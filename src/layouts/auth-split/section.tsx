'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type AuthSplitSectionProps = BoxProps & {
  layoutQuery?: Breakpoint;
};

export function AuthSplitSection({ sx, layoutQuery = 'md', ...other }: AuthSplitSectionProps) {
  const t = useTranslations('auth');

  return (
    <Box
      sx={[
        (theme) => ({
          display: 'none',
          flex: '1 1 auto',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          background: `linear-gradient(160deg, ${theme.vars.palette.primary.dark} 0%, ${theme.vars.palette.primary.main} 60%, ${theme.vars.palette.secondary.main} 100%)`,
          [theme.breakpoints.up(layoutQuery)]: {
            display: 'flex',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Image
        src="/brand/icon-192x192.png"
        alt="vabo"
        width={96}
        height={96}
        style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
        priority
      />

      <Typography
        variant="h3"
        sx={{ color: 'common.white', fontWeight: 800, letterSpacing: '-0.5px' }}
      >
        vabo
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255, 255, 255, 0.72)',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          fontWeight: 400,
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        {t('tagline')}
      </Typography>
    </Box>
  );
}
