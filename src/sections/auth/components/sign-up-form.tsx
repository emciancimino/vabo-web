'use client';

import type { BoxProps } from '@mui/material/Box';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function SignUpForm({ sx, ...other }: BoxProps) {
  const t = useTranslations('auth');

  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Box
      sx={[{ gap: 3, display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Field.Text
          name="firstName"
          label={t('firstName')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="lastName"
          label={t('lastName')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text
        name="email"
        label={t('email')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Password
        name="password"
        label={t('password')}
        placeholder={t('passwordPlaceholder')}
        showToggle
        showStrength
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Password
        name="confirmPassword"
        label={t('confirmPassword')}
        showToggle={false}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('createAccount')}
      </Button>
    </Box>
  );
}
