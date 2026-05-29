'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';

import { useLang } from 'src/providers/lang-provider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
  const { locale } = useLang();

  return (
    <Provider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </Provider>
  );
}
