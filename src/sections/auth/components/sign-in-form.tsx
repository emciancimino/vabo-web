'use client';

import type { BoxProps } from '@mui/material/Box';

import { useTranslations } from 'next-intl';
import { useBoolean } from 'minimal-shared/hooks';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInForm({ sx, ...other }: BoxProps) {
  const t = useTranslations('auth');
  const showPassword = useBoolean();

  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Box
      sx={[{ gap: 3, display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Field.Text
        name="email"
        label={t('email')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Field.Text
          name="password"
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end" aria-label="toggle password visibility">
                    <Iconify icon={showPassword.value ? 'solar:eye-outline' : 'solar:eye-closed-outline'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Link
          component={RouterLink}
          href={paths.auth.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('forgotPassword')}
        </Link>
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('signIn')}
      </Button>
    </Box>
  );
}
