'use client';

import type { UpdatePasswordSchemaType } from './components/schema';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { UpdatePasswordSchema } from './components/schema';
import { FormReturnLink } from './components/form-return-link';
import { FormResendCode } from './components/form-resend-code';

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
  const t = useTranslations('auth');
  const showPassword = useBoolean();

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: { code: '', email: '', password: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (_data) => {
    // TODO: integrate with auth API
  });

  const passwordEndAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={showPassword.onToggle} edge="end" aria-label="toggle password visibility">
        <Iconify icon={showPassword.value ? 'solar:eye-outline' : 'solar:eye-closed-outline'} />
      </IconButton>
    </InputAdornment>
  );

  return (
    <>
      <FormHead
        icon={
          <Box
            component="img"
            alt=""
            src={`${CONFIG.assetsDir}/assets/icons/auth/ic-lock-password.svg`}
            sx={{ width: 96, height: 96 }}
          />
        }
        title={t('updatePassword')}
        description={t('updatePasswordDesc')}
        sx={{ textAlign: 'center' }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Text
            name="email"
            label={t('email')}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Field.Code name="code" />

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
            size="large"
            color="inherit"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('updatePassword')}
          </Button>
        </Box>
      </Form>

      <FormResendCode onResendCode={() => {}} />

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
