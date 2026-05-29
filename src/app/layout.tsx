import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { themeOverrides } from 'src/theme/theme-overrides';
import { themeConfig, ThemeProvider, primary as primaryColor } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          modeStorageKey={themeConfig.modeStorageKey}
          defaultMode={themeConfig.defaultMode}
        />

        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider
                themeOverrides={themeOverrides}
                modeStorageKey={themeConfig.modeStorageKey}
                defaultMode={themeConfig.defaultMode}
              >
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
