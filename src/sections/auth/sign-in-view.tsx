'use client';

import type { SignInSchemaType } from './components/schema';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Form } from 'src/components/hook-form';

import { FormHead } from './components/form-head';
import { SignInSchema } from './components/schema';
import { SignInForm } from './components/sign-in-form';

// ----------------------------------------------------------------------

export function SignInView() {
  const t = useTranslations('auth');

  const defaultValues: SignInSchemaType = { email: '', password: '' };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
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

      <Form methods={methods} onSubmit={onSubmit}>
        <SignInForm />
      </Form>
    </>
  );
}
