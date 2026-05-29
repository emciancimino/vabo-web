import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { UpdatePasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return { title: t('updatePassword') };
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordView />;
}
