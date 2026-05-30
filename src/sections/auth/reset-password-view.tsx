'use client';

import type { ResetPasswordSchemaType } from './components/schema';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';

import { authResetPassword, getAuthErrorMessage } from 'src/lib/api/auth.api';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { ResetPasswordSchema } from './components/schema';
import { FormReturnLink } from './components/form-return-link';

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await authResetPassword({ email: data.email });
      router.push(`${paths.auth.updatePassword}?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  });

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
        title={t('forgotYourPassword')}
        description={t('resetPasswordDesc')}
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
            hiddenLabel
            placeholder={t('email')}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button
            fullWidth
            size="large"
            color="inherit"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('sendRequest')}
          </Button>
        </Box>
      </Form>

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
