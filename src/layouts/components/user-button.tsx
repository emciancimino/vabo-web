'use client';

import type { AuthUser } from 'src/hooks/use-auth-user';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { authSignOut } from 'src/lib/api/auth.api';

// ----------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

type UserButtonProps = {
  user: AuthUser;
};

export function UserButton({ user }: UserButtonProps) {
  const tAuth = useTranslations('auth');
  const tNav = useTranslations('nav');
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signingOut, setSigningOut] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDashboard = () => {
    handleClose();
    router.push(paths.dashboard);
  };

  const handleSignOut = async () => {
    handleClose();
    setSigningOut(true);
    try {
      await authSignOut();
      router.replace(paths.auth.signIn);
    } finally {
      setSigningOut(false);
    }
  };

  const initials = getInitials(user.firstName, user.lastName) || user.email.charAt(0).toUpperCase();
  const displayName = `${user.firstName} ${user.lastName}`.trim() || user.email;

  return (
    <>
      <IconButton onClick={handleOpen} size="small" aria-label="open user menu">
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 'fontWeightBold' }}>
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" noWrap>{displayName}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleDashboard}>
          {tNav('dashboard')}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleSignOut} disabled={signingOut} sx={{ color: 'error.main' }}>
          {tAuth('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
}
