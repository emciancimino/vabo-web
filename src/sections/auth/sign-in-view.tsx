'use client';

import type { SignInSchemaType } from './components/schema';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { authSignIn, getAuthErrorMessage } from 'src/lib/api/auth.api';

import { Logo } from 'src/components/logo';
import { Form } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { SignInSchema } from './components/schema';
import { SignInForm } from './components/sign-in-form';

// ----------------------------------------------------------------------

export function SignInView() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await authSignIn({ email: data.email, password: data.password });
      router.push('/');
    } catch (error) {
      setErrorMsg(getAuthErrorMessage(error));
    }
  });

  return (
    <>
      <Logo sx={{ alignSelf: { xs: 'center', md: 'flex-start' } }} />

      <FormHead
        title={t('signIn')}
        description={
          <>
            {t('noAccount')}{' '}
            <Link component={RouterLink} href={paths.auth.signUp} variant="subtitle2">
              {t('getStarted')}
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
        <SignInForm />
      </Form>
    </>
  );
}
