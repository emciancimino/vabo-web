'use client';

import { useEffect } from 'react';

export function ScrollToTop() {
  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  return null;
}
