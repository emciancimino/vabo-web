import { fetchAuthSession } from 'aws-amplify/auth';

// ----------------------------------------------------------------------
// Client GraphQL sottile e tipizzato.
// - Endpoint unico: NEXT_PUBLIC_API_URL/graphql (gateway multi-dominio del BE).
// - Allega l'access token Cognito come `Authorization: Bearer` quando disponibile.
//   Le query anonime (es. feed pubblico) funzionano comunque senza token.
// ----------------------------------------------------------------------

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/graphql`;

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/** Recupera l'access token corrente, o `null` se l'utente è anonimo. */
async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}

/**
 * Esegue una operazione GraphQL e ritorna i dati tipizzati.
 * Lancia un Error con il primo messaggio in caso di errori GraphQL o HTTP.
 */
export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  const token = await getAccessToken();

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
