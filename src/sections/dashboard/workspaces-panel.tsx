'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  type Workspace,
  roleLabelKey,
  createWorkspace,
  fetchMyWorkspaces,
} from 'src/lib/api/workspaces.api';
import { GraphQLRequestError } from 'src/lib/api/graphql-client';

// ----------------------------------------------------------------------

/** Deriva uno slug url-safe da un nome libero. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function WorkspacesPanel() {
  const t = useTranslations('workspaces');

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mappa il codice errore del BE su un messaggio localizzato.
  const messageForError = (err: unknown): string => {
    if (err instanceof GraphQLRequestError) {
      switch (err.code) {
        case 'SLUG_TAKEN':
          return t('slugTaken');
        case 'INVALID_SLUG':
          return t('invalidSlug');
        case 'INVALID_NAME':
          return t('invalidName');
        default:
          break;
      }
    }
    return t('createError');
  };

  // Finché l'utente non tocca lo slug, lo deriviamo dal nome.
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await fetchMyWorkspaces();
        if (active) setWorkspaces(items);
      } catch {
        if (active) setError(t('loadError'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const handleCreate = async () => {
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    if (!trimmedName || !trimmedSlug) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createWorkspace({ name: trimmedName, slug: trimmedSlug });
      setWorkspaces((prev) => [...prev, created]);
      setName('');
      setSlug('');
      setSlugEdited(false);
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ width: 1, maxWidth: 560, p: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        {t('title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label={t('title')} />
        </Box>
      ) : workspaces.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('empty')}
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {workspaces.map((ws) => (
            <Box
              key={ws.id}
              component={RouterLink}
              href={paths.workspace(ws.id)}
              sx={{
                p: 2,
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                color: 'inherit',
                textDecoration: 'none',
                transition: (theme) => theme.transitions.create('background-color'),
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {ws.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                  /{ws.slug}
                </Typography>
              </Box>
              <Chip
                size="small"
                color={ws.viewerRole === 'OWNER' ? 'primary' : 'default'}
                variant="soft"
                label={t(roleLabelKey(ws.viewerRole))}
              />
            </Box>
          ))}
        </Stack>
      )}

      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <TextField
          fullWidth
          size="small"
          label={t('nameLabel')}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          disabled={submitting}
        />
        <TextField
          fullWidth
          size="small"
          label={t('slugLabel')}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          disabled={submitting}
          helperText={t('slugHelper')}
        />
        <Button
          type="submit"
          variant="contained"
          loading={submitting}
          disabled={!name.trim() || !slug.trim()}
          sx={{ alignSelf: { sm: 'flex-start' } }}
        >
          {submitting ? t('creating') : t('create')}
        </Button>
      </Stack>
    </Card>
  );
}
