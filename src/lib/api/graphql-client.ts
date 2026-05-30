// ----------------------------------------------------------------------
// Client GraphQL sottile e tipizzato.
// - Chiama il BFF same-origin `/api/graphql` (vedi app/api/graphql/route.ts):
//   niente CORS e l'URL reale del gateway resta server-side.
// - L'autenticazione è gestita dal proxy via cookie Amplify (SSR): il browser
//   non maneggia token.
// ----------------------------------------------------------------------

const GRAPHQL_ENDPOINT = '/api/graphql';

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Esegue una operazione GraphQL e ritorna i dati tipizzati.
 * Lancia un Error con il primo messaggio in caso di errori GraphQL o HTTP.
 */
export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Network error: ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!json.data) {
    throw new Error('Empty GraphQL response');
  }

  return json.data;
}
