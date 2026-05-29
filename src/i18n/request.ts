import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { langs } from 'src/layouts/langs-config';

// ----------------------------------------------------------------------

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const stored = cookieStore.get('vabo-lang')?.value;
  const locale = langs.some((l) => l.value === stored) ? (stored as string) : langs[0].value;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
