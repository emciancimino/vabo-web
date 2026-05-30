'use client';

import type { TextFieldProps } from '@mui/material/TextField';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const RULES = [
  { key: 'ruleMinLength', test: (v: string) => v.length >= 8 },
  { key: 'ruleUppercase', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'ruleNumber', test: (v: string) => /[0-9]/.test(v) },
  { key: 'ruleSpecial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  0: 'divider',
  1: 'error.main',
  2: 'warning.main',
  3: 'info.main',
  4: 'success.main',
};

const STRENGTH_LABELS: Record<Exclude<StrengthLevel, 0>, string> = {
  1: 'weak',
  2: 'fair',
  3: 'good',
  4: 'strong',
};

export type RHFPasswordFieldProps = Omit<TextFieldProps, 'type'> & {
  name: string;
  showToggle?: boolean;
  showStrength?: boolean;
};

export function RHFPasswordField({
  name,
  helperText,
  slotProps,
  showToggle = true,
  showStrength = false,
  ...other
}: RHFPasswordFieldProps) {
  const tStrength = useTranslations('auth.strength');
  const { control } = useFormContext();
  const [visible, setVisible] = useState(false);

  const value: string = useWatch({ control, name }) ?? '';
  const strength = RULES.reduce<StrengthLevel>(
    (acc, rule) => (rule.test(value) ? ((acc + 1) as StrengthLevel) : acc),
    0
  );

  const endAdornment = showToggle ? (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setVisible((v) => !v)}
        edge="end"
        aria-label={visible ? 'hide password' : 'show password'}
      >
        <Iconify icon={visible ? 'solar:eye-outline' : 'solar:eye-closed-outline'} />
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            {...field}
            fullWidth
            type={visible ? 'text' : 'password'}
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={{
              ...slotProps,
              htmlInput: {
                ...(slotProps?.htmlInput as object),
                autoComplete: 'new-password',
                onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
                onPaste: (e: React.ClipboardEvent) => e.preventDefault(),
              },
              input: {
                ...(slotProps?.input as object),
                endAdornment,
              },
            }}
            {...other}
          />

          {showStrength && value.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
                  {([1, 2, 3, 4] as const).map((level) => (
                    <Box
                      key={level}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 1,
                        bgcolor: strength >= level ? STRENGTH_COLORS[strength] : 'divider',
                        transition: 'background-color 0.2s ease',
                      }}
                    />
                  ))}
                </Box>

                {strength > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: STRENGTH_COLORS[strength], minWidth: 36, textAlign: 'right' }}
                  >
                    {tStrength(STRENGTH_LABELS[strength as Exclude<StrengthLevel, 0>])}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {RULES.map((rule) => {
                  const passed = rule.test(value);
                  return (
                    <Box key={rule.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      {passed ? (
                        <Iconify
                          icon="solar:check-circle-bold"
                          sx={{ color: 'success.main', width: 14, height: 14 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '1.5px solid',
                            borderColor: 'text.disabled',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: passed ? 'text.primary' : 'text.disabled' }}
                      >
                        {tStrength(rule.key)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      )}
    />
  );
}
