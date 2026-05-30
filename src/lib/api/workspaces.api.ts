import { graphqlRequest } from './graphql-client';

// ----------------------------------------------------------------------
// Dominio workspaces — proiezione dei tipi GraphQL del BE.
// Le query vivono nel registro persisted operations (graphql-operations.ts);
// qui si referenziano solo per `operationId`.
// ----------------------------------------------------------------------

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------

/** I workspace di cui l'utente autenticato è membro (qualsiasi ruolo). */
export async function fetchMyWorkspaces(): Promise<Workspace[]> {
  const data = await graphqlRequest<{ myWorkspaces: Workspace[] }>('MyWorkspaces');
  return data.myWorkspaces;
}

/** Crea un workspace; il creatore diventa OWNER. Richiede il gruppo Cognito 'users'. */
export async function createWorkspace(input: {
  name: string;
  slug: string;
}): Promise<Workspace> {
  const data = await graphqlRequest<{ createWorkspace: Workspace }, { input: typeof input }>(
    'CreateWorkspace',
    { input }
  );
  return data.createWorkspace;
}
