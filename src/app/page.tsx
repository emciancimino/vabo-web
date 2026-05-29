import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

export default function HomePage() {
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
          <Typography variant="h2">Vabo</Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
