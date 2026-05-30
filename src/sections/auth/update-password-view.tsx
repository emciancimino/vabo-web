'use client';

import type { UpdatePasswordSchemaType } from './components/schema';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useCountdownSeconds } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';

import { authConfirmResetPassword, authResetPassword, getAuthErrorMessage } from 'src/lib/api/auth.api';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { UpdatePasswordSchema } from './components/schema';
import { FormReturnLink } from './components/form-return-link';
import { FormResendCode } from './components/form-resend-code';

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const showPassword = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');
  const { value: countdown, start: startCountdown } = useCountdownSeconds(60);

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: { code: '', email: emailFromQuery, password: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await authConfirmResetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.password,
      });
      router.push(paths.auth.signIn);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  });

  const handleResend = async () => {
    const email = methods.getValues('email');
    try {
      await authResetPassword({ email });
      startCountdown();
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  };

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

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

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

      <FormResendCode
        onResendCode={handleResend}
        disabled={countdown > 0}
        value={countdown}
      />

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
