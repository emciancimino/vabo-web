'use client';

import type { LinkProps } from '@mui/material/Link';

import { useTranslations } from 'next-intl';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormReturnLinkProps = LinkProps & {
  href: string;
};

export function FormReturnLink({ sx, href, ...other }: FormReturnLinkProps) {
  const t = useTranslations('auth');

  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="subtitle2"
      sx={[
        { mt: 3, gap: 0.5, mx: 'auto', alignItems: 'center', display: 'inline-flex' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify width={16} icon="eva:arrow-ios-back-fill" />
      {t('returnToSignIn')}
    </Link>
  );
}
