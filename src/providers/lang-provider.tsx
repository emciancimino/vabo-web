'use client';

import { useLocale } from 'next-intl';

// ----------------------------------------------------------------------

const LANG_COOKIE = 'vabo-lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function useLang() {
  const locale = useLocale();

  function setLocale(newLocale: string) {
    document.cookie = `${LANG_COOKIE}=${newLocale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
    window.location.reload();
  }

  return { locale, setLocale };
}
