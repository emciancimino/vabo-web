import type { Metadata } from 'next';

import Container from '@mui/material/Container';

import { MainLayout } from 'src/layouts/main';

import { WorkspaceDetail } from 'src/sections/dashboard/workspace-detail';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Workspace — vabo',
};

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 12 }}>
        <WorkspaceDetail workspaceId={id} />
      </Container>
    </MainLayout>
  );
}
