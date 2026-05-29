import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  assetsDir: string;
  googleMapApiKey: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Vabo',
  appVersion: packageJson.version,
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  googleMapApiKey: process.env.NEXT_PUBLIC_MAP_API ?? '',
};
