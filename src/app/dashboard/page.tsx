import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { MainLayout } from 'src/layouts/main';

import { SignOutButton } from 'src/sections/dashboard/sign-out-button';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard — vabo',
};

export default function DashboardPage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 12,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <Typography variant="h2">Dashboard</Typography>

          <SignOutButton />
        </Box>
      </Container>
    </MainLayout>
  );
}
