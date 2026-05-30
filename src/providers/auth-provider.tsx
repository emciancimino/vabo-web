'use client';

import { Amplify } from 'aws-amplify';

import { amplifyConfig } from 'src/lib/auth/amplify';

// Configure once at module level — { ssr: true } enables cookie-based token
// storage so Server Components can read the session via runWithAmplifyServerContext.
Amplify.configure(amplifyConfig, { ssr: true });

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
