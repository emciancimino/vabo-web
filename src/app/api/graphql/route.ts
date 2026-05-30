import type { NextRequest } from 'next/server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';

import { runWithAmplifyServerContext } from 'src/lib/auth/amplify-server';

// ----------------------------------------------------------------------
// BFF proxy verso il gateway GraphQL del BE.
// - Same-origin per il browser (`/api/graphql`): niente CORS.
// - L'URL del gateway resta server-side (env non pubblica), mai nel bundle.
// - Il token Cognito viene letto dai cookie Amplify (SSR) e inoltrato come Bearer.
// ----------------------------------------------------------------------

export const runtime = 'nodejs';

const GATEWAY_URL = `${process.env.API_URL ?? ''}/graphql`;

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
    return NextResponse.json({ errors: [{ message: 'API_URL not configured' }] }, { status: 500 });
  }

  const body = await request.text();
  const token = await getAccessToken();

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  // Inoltra la risposta del gateway così com'è (status + JSON).
  const payload = await res.text();
  return new NextResponse(payload, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
