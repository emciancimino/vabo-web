import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('nav');
  return { title: t('support') };
}

export default function SupportPage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 12,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h2">Support</Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
