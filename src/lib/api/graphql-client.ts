import type { GraphQLOperationId } from './graphql-operations';

// ----------------------------------------------------------------------
// Client GraphQL sottile e tipizzato.
// - Chiama il BFF same-origin `/api/graphql` (vedi app/api/graphql/route.ts):
//   niente CORS e l'URL reale del gateway resta server-side.
// - Invia solo l'`operationId` (persisted operation) + variabili: la query grezza
//   non lascia mai il client né attraversa il proxy. L'auth è gestita dal BFF via
//   cookie Amplify (SSR): il browser non maneggia token.
// ----------------------------------------------------------------------

const GRAPHQL_ENDPOINT = '/api/graphql';

interface GraphQLError {
  message: string;
  extensions?: { code?: string };
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Errore GraphQL con `code` stabile (da extensions.code del BE), così la UI può
 * mappare il codice su un messaggio localizzato invece del testo grezzo.
 */
export class GraphQLRequestError extends Error {
  readonly code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'GraphQLRequestError';
    this.code = code;
  }
}

/**
 * Esegue un'operazione GraphQL registrata e ritorna i dati tipizzati.
 * Lancia un GraphQLRequestError (con eventuale `code`) in caso di errori GraphQL o HTTP.
 */
export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  operationId: GraphQLOperationId,
  variables?: TVariables
): Promise<TData> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationId, variables }),
  });

  if (!res.ok) {
    throw new GraphQLRequestError(`Network error: ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    const first = json.errors[0];
    throw new GraphQLRequestError(first.message, first.extensions?.code);
  }
  if (!json.data) {
    throw new GraphQLRequestError('Empty GraphQL response');
  }

  return json.data;
}
