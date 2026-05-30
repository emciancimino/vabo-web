import { graphqlRequest } from './graphql-client';

// ----------------------------------------------------------------------
// Dominio workspaces — proiezione dei tipi GraphQL del BE.
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

const MY_WORKSPACES_QUERY = /* GraphQL */ `
  query MyWorkspaces {
    myWorkspaces {
      id
      name
      slug
      ownerId
      createdAt
      updatedAt
    }
  }
`;

const CREATE_WORKSPACE_MUTATION = /* GraphQL */ `
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      slug
      ownerId
      createdAt
      updatedAt
    }
  }
`;

/** I workspace di cui l'utente autenticato è membro (qualsiasi ruolo). */
export async function fetchMyWorkspaces(): Promise<Workspace[]> {
  const data = await graphqlRequest<{ myWorkspaces: Workspace[] }>(MY_WORKSPACES_QUERY);
  return data.myWorkspaces;
}

/** Crea un workspace; il creatore diventa OWNER. Richiede il gruppo Cognito 'users'. */
export async function createWorkspace(input: {
  name: string;
  slug: string;
}): Promise<Workspace> {
  const data = await graphqlRequest<{ createWorkspace: Workspace }, { input: typeof input }>(
    CREATE_WORKSPACE_MUTATION,
    { input }
  );
  return data.createWorkspace;
}
