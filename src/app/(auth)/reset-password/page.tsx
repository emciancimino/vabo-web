import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { ResetPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return { title: t('forgotYourPassword') };
}

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
