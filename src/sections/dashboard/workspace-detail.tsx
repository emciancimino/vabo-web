'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthUser } from 'src/hooks/use-auth-user';
import {
  type Role,
  type Member,
  type Workspace,
  removeMember,
  fetchWorkspace,
  addMemberByEmail,
  fetchWorkspaceMembers,
} from 'src/lib/api/workspaces.api';
import { GraphQLRequestError } from 'src/lib/api/graphql-client';

// ----------------------------------------------------------------------

// OWNER non è assegnabile: la proprietà si stabilisce alla creazione e cambia
// solo via trasferimento. L'add-member offre solo i ruoli concedibili.
const ASSIGNABLE_ROLES: Role[] = ['VIEWER', 'CONTRIBUTOR', 'ADMIN'];

/** True se il membro ha un nome/cognome dal profilo. */
function hasName(m: Member): boolean {
  return Boolean(m.firstName?.trim() || m.lastName?.trim());
}

/** Etichetta primaria del membro: nome completo → email → userId (fallback). */
function memberName(m: Member): string {
  const full = `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim();
  return full || m.email || m.userId;
}

export function WorkspaceDetail({ workspaceId }: { workspaceId: string }) {
  const t = useTranslations('workspaces');
  const { user } = useAuthUser();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('VIEWER');
  const [submitting, setSubmitting] = useState(false);

  const roleLabel = useCallback(
    (role: Role) =>
      t(
        `role${role.charAt(0)}${role.slice(1).toLowerCase()}` as
          | 'roleViewer'
          | 'roleContributor'
          | 'roleAdmin'
          | 'roleOwner'
      ),
    [t]
  );

  const messageForError = useCallback(
    (err: unknown): string => {
      if (err instanceof GraphQLRequestError) {
        switch (err.code) {
          case 'CANNOT_GRANT_HIGHER_ROLE':
            return t('errGrantHigher');
          case 'CANNOT_REMOVE_HIGHER_ROLE':
            return t('errRemoveHigher');
          case 'CANNOT_REMOVE_LAST_OWNER':
            return t('errRemoveLastOwner');
          case 'CANNOT_GRANT_OWNER':
            return t('errGrantOwner');
          case 'USER_NOT_FOUND':
            return t('errUserNotFound');
          case 'PROFILE_NOT_CONFIRMED':
            return t('errProfileNotConfirmed');
          case 'FORBIDDEN':
            return t('errForbidden');
          default:
            break;
        }
      }
      return t('memberActionError');
    },
    [t]
  );

  const loadMembers = useCallback(async () => {
    setMembers(await fetchWorkspaceMembers(workspaceId));
  }, [workspaceId]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ws = await fetchWorkspace(workspaceId);
        if (!active) return;
        if (!ws) {
          setNotFound(true);
          return;
        }
        setWorkspace(ws);
        setMembers(await fetchWorkspaceMembers(workspaceId));
      } catch {
        if (active) setError(t('loadError'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [workspaceId, t]);

  const handleAdd = async () => {
    const email = newEmail.trim();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      await addMemberByEmail(workspaceId, email, newRole);
      await loadMembers();
      setNewEmail('');
      setNewRole('VIEWER');
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await removeMember(workspaceId, userId);
      await loadMembers();
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Alert severity="warning">{t('notFound')}</Alert>
        <Link component={RouterLink} href={paths.dashboard}>
          {t('back')}
        </Link>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Link component={RouterLink} href={paths.dashboard} variant="body2">
          ← {t('back')}
        </Link>
        <Typography variant="h3" component="h1" sx={{ mt: 1 }}>
          {workspace?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          /{workspace?.slug}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          {t('membersTitle')}
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {members.map((m) => (
            <Box
              key={m.userId}
              sx={{
                p: 2,
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {memberName(m)}
                  {user?.userId === m.userId && (
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({t('you')})
                    </Typography>
                  )}
                </Typography>
                {hasName(m) && m.email && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                    {m.email}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
                <Chip
                  size="small"
                  color={m.role === 'OWNER' ? 'primary' : 'default'}
                  variant="soft"
                  label={roleLabel(m.role)}
                />
                {m.role !== 'OWNER' && (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={submitting}
                    onClick={() => handleRemove(m.userId)}
                  >
                    {t('remove')}
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t('addMember')}
        </Typography>
        <Stack
          component="form"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <TextField
            fullWidth
            size="small"
            type="email"
            label={t('emailLabel')}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={submitting}
          />
          <TextField
            select
            size="small"
            label={t('roleLabel')}
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as Role)}
            disabled={submitting}
            sx={{ minWidth: 160 }}
          >
            {ASSIGNABLE_ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {roleLabel(r)}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            loading={submitting}
            disabled={!newEmail.trim()}
            sx={{ flexShrink: 0 }}
          >
            {t('add')}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}
