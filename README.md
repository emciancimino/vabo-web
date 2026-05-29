# vabo-web

Frontend del prodotto vabo — Next.js 16, React 19, MUI v9.

> Codice proprietario e confidenziale. Tutti i diritti riservati.

## Stack

- **Framework**: Next.js 16 (App Router) — React 19
- **UI**: MUI v9 + Emotion
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

## Comandi

```bash
pnpm dev        # Dev server su https://local.vabo.tools:3000
pnpm build      # Build di produzione
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
pnpm fm:fix     # Prettier
```

## Convenzioni

Vedere [CLAUDE.md](./CLAUDE.md) per le regole di sviluppo complete.
