import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import { VerifyView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth');
  return { title: t('checkYourEmail') };
}

export default function VerifyPage() {
  return <VerifyView />;
}
