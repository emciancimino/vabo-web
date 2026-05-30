'use client';

import type { VerifySchemaType } from './components/schema';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdownSeconds } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useSearchParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';

import { authConfirmSignUp, authResendSignUpCode, getAuthErrorMessage } from 'src/lib/api/auth.api';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { VerifySchema } from './components/schema';
import { FormReturnLink } from './components/form-return-link';
import { FormResendCode } from './components/form-resend-code';

// ----------------------------------------------------------------------

export function VerifyView() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [errorMsg, setErrorMsg] = useState('');
  const { value: countdown, start: startCountdown } = useCountdownSeconds(60);

  const methods = useForm<VerifySchemaType>({
    mode: 'onChange',
    resolver: zodResolver(VerifySchema),
    defaultValues: { code: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await authConfirmSignUp({ email, code: data.code });
      router.push(paths.auth.signIn);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  });

  const handleResend = async () => {
    try {
      await authResendSignUpCode({ email });
      startCountdown();
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  };

  return (
    <>
      <FormHead
        icon={
          <Box
            component="img"
            alt=""
            src={`${CONFIG.assetsDir}/assets/icons/auth/ic-email-inbox.svg`}
            sx={{ width: 96, height: 96 }}
          />
        }
        title={t('checkYourEmail')}
        description={t('verifyDesc')}
        sx={{ textAlign: 'center' }}
      />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Field.Code name="code" />

          <Button
            fullWidth
            size="large"
            color="inherit"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('verify')}
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
