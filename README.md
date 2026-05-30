# vabo-web

Frontend del prodotto vabo — Next.js 16, React 19, MUI v9.

> Codice proprietario e confidenziale. Tutti i diritti riservati.

## Stack

- **Framework**: Next.js 16 (App Router) — React 19
- **UI**: MUI v9 + Emotion
- **Auth**: AWS Amplify v6 (SSR mode, cookie-based)
- **i18n**: next-intl (EN, IT, FR, DE)
- **Language**: TypeScript (strict)
- **Package manager**: pnpm

## Prerequisiti

- Node.js 20+
- pnpm
- [`mkcert`](https://github.com/FiloSottile/mkcert) per il certificato SSL locale

## Setup

```bash
pnpm install
```

Genera il certificato SSL per il dominio locale:

```bash
mkcert local.vabo.tools localhost 127.0.0.1
mv local.vabo.tools+2.pem certificates/
mv local.vabo.tools+2-key.pem certificates/
```

Sincronizza le variabili d'ambiente dal backend (richiede un deploy di `vabo-be` attivo):

```bash
pnpm sync-env          # stage dev (default)
pnpm sync-env dev      # esplicito
```

## Comandi

```bash
pnpm dev        # Dev server su https://local.vabo.tools:3000
pnpm build      # Build di produzione
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
pnpm fm:fix     # Prettier
pnpm sync-env   # Sincronizza .env.local da vabo-be outputs
```

## Auth

Integrazione Cognito via Amplify v6 in SSR mode:

- Tokens in cookie httpOnly — leggibili server-side da Server Components e proxy
- `src/proxy.ts` gestisce il routing:
  - Utenti non autenticati su rotte protette → `/sign-in?returnTo=...`
  - Utenti autenticati su rotte auth → `/dashboard`
- **Rotte protette**: `/dashboard`, `/settings`, `/profile`
- **Rotte auth**: `/sign-in`, `/sign-up`, `/reset-password`, `/update-password`, `/verify`
- `useAuthUser` hook — carica profilo utente da Amplify lato client
- `UserButton` nell'header — avatar con iniziali, dropdown con Dashboard e Sign out

### Password field (`Field.Password`)

Componente riutilizzabile `RHFPasswordField` con:
- Strength indicator a 4 segmenti (debole → forte)
- Checklist delle regole (8+ chars, maiuscola, numero, carattere speciale)
- `showToggle` — toggle visibilità (default `true`, `false` per il campo conferma)
- `showStrength` — strength indicator + checklist (default `false`, `true` sul campo principale)
- No copy/paste, `autoComplete="new-password"`

## Convenzioni

Vedere [CLAUDE.md](./CLAUDE.md) per le regole di sviluppo complete.
