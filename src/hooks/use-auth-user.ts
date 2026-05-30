'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// ----------------------------------------------------------------------

export type AuthUser = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function useAuthUser(): { user: AuthUser | null; loading: boolean } {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const current = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        setUser({
          userId: current.userId,
          email: attrs.email ?? current.username,
          firstName: attrs.given_name ?? '',
          lastName: attrs.family_name ?? '',
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { user, loading };
}
