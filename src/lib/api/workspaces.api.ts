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

export type Role = 'VIEWER' | 'CONTRIBUTOR' | 'ADMIN' | 'OWNER';

export interface Member {
  userId: string;
  role: Role;
  grantedBy: string;
  grantedAt: string;
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

/** Singolo workspace. Null se non sei membro (il BE non rivela l'esistenza ai non-membri). */
export async function fetchWorkspace(id: string): Promise<Workspace | null> {
  const data = await graphqlRequest<{ workspace: Workspace | null }, { id: string }>('Workspace', {
    id,
  });
  return data.workspace;
}

/** Membri del workspace. Richiede appartenenza (VIEWER+). */
export async function fetchWorkspaceMembers(workspaceId: string): Promise<Member[]> {
  const data = await graphqlRequest<{ workspaceMembers: Member[] }, { workspaceId: string }>(
    'WorkspaceMembers',
    { workspaceId }
  );
  return data.workspaceMembers;
}

/** Assegna un ruolo a un utente. Richiede ADMIN+; non si può concedere un ruolo superiore al proprio. */
export async function addMember(
  workspaceId: string,
  userId: string,
  role: Role
): Promise<Member> {
  const data = await graphqlRequest<
    { addMember: Member },
    { workspaceId: string; userId: string; role: Role }
  >('AddMember', { workspaceId, userId, role });
  return data.addMember;
}

/** Rimuove un membro. Richiede ADMIN+; non si può rimuovere un ruolo superiore al proprio né l'ultimo OWNER. */
export async function removeMember(workspaceId: string, userId: string): Promise<boolean> {
  const data = await graphqlRequest<
    { removeMember: boolean },
    { workspaceId: string; userId: string }
  >('RemoveMember', { workspaceId, userId });
  return data.removeMember;
}
