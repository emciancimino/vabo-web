'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { authSignOut } from 'src/lib/api/auth.api';

// ----------------------------------------------------------------------

export function SignOutButton() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authSignOut();
      router.replace(paths.auth.signIn);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="inherit"
      loading={loading}
      onClick={handleSignOut}
    >
      {t('signOut')}
    </Button>
  );
}
