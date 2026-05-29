'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { langs } from 'src/layouts/langs-config';

// ----------------------------------------------------------------------

const LANG_COOKIE = 'vabo-lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type LangContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LangContext = createContext<LangContextValue>({
  locale: langs[0].value,
  setLocale: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

// ----------------------------------------------------------------------

type LangProviderProps = {
  children: React.ReactNode;
  initialLocale?: string;
};

export function LangProvider({ children, initialLocale }: LangProviderProps) {
  const [locale, setLocaleState] = useState(initialLocale ?? langs[0].value);

  const setLocale = useCallback((newLocale: string) => {
    setLocaleState(newLocale);
    document.cookie = `${LANG_COOKIE}=${newLocale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
  }, []);

  return <LangContext.Provider value={{ locale, setLocale }}>{children}</LangContext.Provider>;
}
