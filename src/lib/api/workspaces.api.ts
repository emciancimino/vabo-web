import { graphqlRequest } from './graphql-client';

// ----------------------------------------------------------------------
// Dominio workspaces — proiezione dei tipi GraphQL del BE.
// Le query vivono nel registro persisted operations (graphql-operations.ts);
// qui si referenziano solo per `operationId`.
// ----------------------------------------------------------------------

export type Role = 'VIEWER' | 'CONTRIBUTOR' | 'ADMIN' | 'OWNER';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  /** Ruolo dell'utente corrente su questo workspace. */
  viewerRole: Role;
}

export interface Member {
  userId: string;
  role: Role;
  grantedBy: string;
  grantedAt: string;
  // Campi profilo: null se l'utente non ha ancora un profilo vabo.
  email: string | null;
  firstName: string | null;
  lastName: string | null;
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

/**
 * Aggiunge un membro tramite l'email di registrazione vabo. Richiede ADMIN+; l'utente
 * deve essere registrato e avere un profilo confermato; non si può concedere OWNER né un
 * ruolo superiore al proprio.
 */
export async function addMemberByEmail(
  workspaceId: string,
  email: string,
  role: Role
): Promise<Member> {
  const data = await graphqlRequest<
    { addMemberByEmail: Member },
    { workspaceId: string; email: string; role: Role }
  >('AddMemberByEmail', { workspaceId, email, role });
  return data.addMemberByEmail;
}

/** Rimuove un membro. Richiede ADMIN+; non si può rimuovere un ruolo superiore al proprio né l'ultimo OWNER. */
export async function removeMember(workspaceId: string, userId: string): Promise<boolean> {
  const data = await graphqlRequest<
    { removeMember: boolean },
    { workspaceId: string; userId: string }
  >('RemoveMember', { workspaceId, userId });
  return data.removeMember;
}
