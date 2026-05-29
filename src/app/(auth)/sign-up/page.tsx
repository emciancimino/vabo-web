import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { SignUpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return { title: t('signUp') };
}

export default function SignUpPage() {
  return <SignUpView />;
}
