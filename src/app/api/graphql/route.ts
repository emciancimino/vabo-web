import type { NextRequest } from 'next/server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';

import { runWithAmplifyServerContext } from 'src/lib/auth/amplify-server';
import { GRAPHQL_OPERATIONS, isAllowedOperation } from 'src/lib/api/graphql-operations';

// ----------------------------------------------------------------------
// BFF proxy verso il gateway GraphQL del BE.
// - Same-origin per il browser (`/api/graphql`): niente CORS.
// - L'URL del gateway resta server-side (env non pubblica), mai nel bundle.
// - Il token Cognito viene letto dai cookie Amplify (SSR) e inoltrato come Bearer.
//
// SICUREZZA / SCALABILITÀ:
// - Allow-list: inoltra SOLO operazioni registrate (persisted operations), mai
//   query grezze arrivate dal client → nessuna query arbitraria/abusiva.
// - Cap sulla dimensione del body e content-type obbligatorio.
// - Timeout sul fetch al gateway: non lasciamo appese le richieste server.
// ----------------------------------------------------------------------

export const runtime = 'nodejs';

const GATEWAY_URL = `${process.env.API_URL ?? ''}/graphql`;
const MAX_BODY_BYTES = 16 * 1024; // l'id+variabili è piccolo: 16KB è abbondante
const GATEWAY_TIMEOUT_MS = 15_000;

function gqlError(message: string, status: number): NextResponse {
  return NextResponse.json({ errors: [{ message }] }, { status });
}

/** Recupera l'access token dalla sessione Amplify SSR (cookie), o null se anonimo. */
async function getAccessToken(): Promise<string | null> {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens?.accessToken?.toString() ?? null;
      } catch {
        return null;
      }
    },
  });
}

export async function POST(request: NextRequest) {
  if (!process.env.API_URL) {
    return gqlError('API_URL not configured', 500);
  }

  // Content-type obbligatorio.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return gqlError('Expected application/json', 415);
  }

  // Cap dimensione body (difesa anti-abuso, prima di leggere tutto).
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return gqlError('Payload too large', 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return gqlError('Payload too large', 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return gqlError('Invalid JSON body', 400);
  }

  // No batching: accettiamo un solo oggetto operazione, non un array.
  if (Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null) {
    return gqlError('Batched or malformed requests are not allowed', 400);
  }

  const { operationId, variables } = parsed as {
    operationId?: unknown;
    variables?: unknown;
  };

  // Allow-list: solo operazioni registrate.
  if (!isAllowedOperation(operationId)) {
    return gqlError('Unknown operation', 400);
  }

  const token = await getAccessToken();

  // La query inoltrata viene SEMPRE dal registro server, mai dal client.
  const body = JSON.stringify({
    query: GRAPHQL_OPERATIONS[operationId],
    variables: variables ?? {},
  });

  let res: Response;
  try {
    res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
      signal: AbortSignal.timeout(GATEWAY_TIMEOUT_MS),
    });
  } catch {
    return gqlError('Upstream gateway unavailable', 502);
  }

  // Inoltra la risposta del gateway così com'è (status + JSON).
  const payload = await res.text();
  return new NextResponse(payload, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
