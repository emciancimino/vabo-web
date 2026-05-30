// ----------------------------------------------------------------------
// Registro delle operazioni GraphQL consentite (persisted operations).
//
// SICUREZZA: il BFF (app/api/graphql/route.ts) inoltra al gateway SOLO le query
// presenti qui, selezionate per `operationId`. Il client non invia mai una query
// grezza: manda l'id + le variabili. Questo rende `/api/graphql` un allow-list
// chiuso — non è possibile eseguire query arbitrarie attraverso il proxy.
//
// Aggiungere una nuova operazione = aggiungere una voce qui (server è l'autorità).
// ----------------------------------------------------------------------

export const GRAPHQL_OPERATIONS = {
  MyWorkspaces: /* GraphQL */ `
    query MyWorkspaces {
      myWorkspaces {
        id
        name
        slug
        ownerId
        createdAt
        updatedAt
        viewerRole
      }
    }
  `,
  CreateWorkspace: /* GraphQL */ `
    mutation CreateWorkspace($input: CreateWorkspaceInput!) {
      createWorkspace(input: $input) {
        id
        name
        slug
        ownerId
        createdAt
        updatedAt
        viewerRole
      }
    }
  `,
  Workspace: /* GraphQL */ `
    query Workspace($id: ID!) {
      workspace(id: $id) {
        id
        name
        slug
        ownerId
        createdAt
        updatedAt
        viewerRole
      }
    }
  `,
  WorkspaceMembers: /* GraphQL */ `
    query WorkspaceMembers($workspaceId: ID!) {
      workspaceMembers(workspaceId: $workspaceId) {
        userId
        role
        grantedBy
        grantedAt
        email
        firstName
        lastName
      }
    }
  `,
  AddMemberByEmail: /* GraphQL */ `
    mutation AddMemberByEmail($workspaceId: ID!, $email: String!, $role: Role!) {
      addMemberByEmail(workspaceId: $workspaceId, email: $email, role: $role) {
        userId
        role
        grantedBy
        grantedAt
        email
        firstName
        lastName
      }
    }
  `,
  RemoveMember: /* GraphQL */ `
    mutation RemoveMember($workspaceId: ID!, $userId: ID!) {
      removeMember(workspaceId: $workspaceId, userId: $userId)
    }
  `,
} as const;

export type GraphQLOperationId = keyof typeof GRAPHQL_OPERATIONS;

/** True se la stringa corrisponde a un'operazione registrata (type guard). */
export function isAllowedOperation(id: unknown): id is GraphQLOperationId {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(GRAPHQL_OPERATIONS, id);
}
