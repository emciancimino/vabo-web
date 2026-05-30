'use client';

import type { BoxProps } from '@mui/material/Box';

import { useTranslations } from 'next-intl';
import { useBoolean } from 'minimal-shared/hooks';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignUpForm({ sx, ...other }: BoxProps) {
  const t = useTranslations('auth');
  const showPassword = useBoolean();

  const {
    formState: { isSubmitting },
  } = useFormContext();

  const passwordEndAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={showPassword.onToggle} edge="end" aria-label="toggle password visibility">
        <Iconify icon={showPassword.value ? 'solar:eye-outline' : 'solar:eye-closed-outline'} />
      </IconButton>
    </InputAdornment>
  );

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

      <Field.Text
        name="password"
        label={t('password')}
        placeholder={t('passwordPlaceholder')}
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{ inputLabel: { shrink: true }, input: { endAdornment: passwordEndAdornment } }}
      />

      <Field.Text
        name="confirmPassword"
        label={t('confirmPassword')}
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{ inputLabel: { shrink: true }, input: { endAdornment: passwordEndAdornment } }}
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
