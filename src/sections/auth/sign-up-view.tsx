'use client';

import type { SignUpSchemaType } from './components/schema';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { authSignUp, getAuthErrorMessage } from 'src/lib/api/auth.api';

import { Logo } from 'src/components/logo';
import { Form } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { SignUpSchema } from './components/schema';
import { SignUpForm } from './components/sign-up-form';

// ----------------------------------------------------------------------

export function SignUpView() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await authSignUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      });

      router.push(`${paths.auth.verify}?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  });

  return (
    <>
      <Logo sx={{ alignSelf: { xs: 'center', md: 'flex-start' } }} />

      <FormHead
        title={t('getStarted')}
        description={
          <>
            {t('hasAccount')}{' '}
            <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
              {t('signIn')}
            </Link>
          </>
        }
        sx={{ mt: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <SignUpForm />
      </Form>
    </>
  );
}
