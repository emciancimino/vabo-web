'use client';

import type { LinkProps } from '@mui/material/Link';

import Image from 'next/image';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({ sx, disabled, className, href = '/', isSingle: _isSingle, ...other }: LogoProps) {
  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="vabo home"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 36,
          height: 36,
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Image
        src="/brand/icon-192x192.png"
        alt="vabo"
        width={192}
        height={192}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        priority
      />
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'inherit',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
