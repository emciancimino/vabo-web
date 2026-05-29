'use client';

import type { SignUpSchemaType } from './components/schema';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Form } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { SignUpSchema } from './components/schema';
import { SignUpForm } from './components/sign-up-form';

// ----------------------------------------------------------------------

export function SignUpView() {
  const t = useTranslations('auth');

  const defaultValues: SignUpSchemaType = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (_data) => {
    // TODO: integrate with auth API
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

      <Form methods={methods} onSubmit={onSubmit}>
        <SignUpForm />
      </Form>
    </>
  );
}
