# vabo-web — Frontend Guide

## Regole di progetto
- Il nome del prodotto è **vabo** — la v è sempre minuscola, ovunque (testi, config, metadata, commenti)
- **Responsive mobile-first** — ogni componente deve funzionare su mobile prima che su desktop
- **Accessibilità WCAG 2.1 AA** minimo, target AAA — contrasto, label, focus visibile, aria-label, semantica HTML
- **Multilanguage** — ogni stringa visibile all'utente passa per next-intl; nessuna stringa hardcoded nei componenti
- **SEO** — ogni pagina ha `<title>` e `<meta description>` via `export const metadata`; immagini con `alt`; heading gerarchici; URL semantici
- **Sicurezza** — nessun segreto in bundle client; sanitizzare input utente; Content Security Policy; nessuna dipendenza inutile
- **Prestazioni** — lazy load componenti pesanti; ottimizzare immagini con `next/image`; minimizzare bundle client; misurare con Lighthouse prima del merge
- **Scalabilità** — nessuna logica di business nei componenti UI; separare concerns (UI / hooks / API); progettare per team separati

## Stack
- **Framework**: Next.js 16 (App Router) — React 19
- **UI**: MUI v9 + Emotion
- **Design system**: Zone UI template (v4.5.1) — adattato per vabo
- **Icons**: Iconify (`@iconify/react`)
- **Language**: TypeScript (strict mode)
- **Package manager**: pnpm
- **Region**: —

## Key Commands
```bash
pnpm dev        # Dev server HTTPS su local.vabo.tools:3000
pnpm build      # Production build
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
pnpm fm:fix     # Prettier
```

## Project Structure
```
src/
  app/                  # Next.js App Router: pages, layouts, route segments
  components/
    ui/                 # Primitivi riutilizzabili (Button, Input, Badge…)
    layout/             # Struttura pagina (Navbar, Footer, Sidebar…)
    [feature]/          # Componenti domain-specific
    # Componenti dal template Zone: animate/, carousel/, hook-form/, ecc.
  hooks/                # Custom React hooks
  layouts/              # Layout completi (main, auth-*, simple) — dal template
  lib/
    api/                # Funzioni di chiamata API, una per dominio
  locales/              # i18n provider
  routes/
    paths.ts            # Tutte le rotte dell'app
    hooks/              # useRouter, usePathname, ecc.
    components/         # RouterLink
  theme/                # Sistema tema MUI completo
  types/                # TypeScript types condivisi (usati in >1 file)
  providers/            # React Context providers (LangProvider, ecc.)
  utils/                # format-number, format-time
  assets/
    data/               # countries.ts e altri dati statici
  global-config.ts      # CONFIG globale (appName, assetsDir, ecc.)
  global.css            # CSS globale
```

## Naming Conventions

| Cosa | Regola | Esempio |
|---|---|---|
| File componenti | `kebab-case.tsx` | `user-avatar.tsx` |
| File hook | `use-kebab-case.ts` | `use-auth.ts` |
| File utils / api | `kebab-case.ts` | `profile.api.ts` |
| Export componenti | PascalCase named export | `export function UserAvatar` |
| Export hooks | camelCase con prefisso `use` | `export function useAuth` |
| Tipi / Interface | PascalCase | `type UserProfile` |
| Costanti locali | camelCase | `const maxFileSize` |
| Costanti globali di config | UPPER_SNAKE_CASE | `const API_BASE_URL` |
| Route segments | lowercase (Next.js) | `app/profile/[slug]/page.tsx` |

## Regole Fondamentali

### Nome prodotto
Sempre **vabo** con v minuscola — mai "Vabo", "VABO" o altre varianti.

### Export
- **Nessun `default export`** tranne nei file `page.tsx` e `layout.tsx`.
- Tutti gli altri file usano named exports.

### Import Alias
- L'alias `src/` (via `baseUrl`) è usato per tutti gli import interni.
  ```ts
  // ✅
  import { CONFIG } from 'src/global-config';
  // ❌
  import { CONFIG } from '../../../global-config';
  ```

### Server vs Client Components
- Default: **Server Component** (nessun `"use client"`).
- Aggiungere `"use client"` solo se il componente usa hooks, eventi, o stato client-side.

### API Calls
- Tutte le chiamate al BE vivono in `src/lib/api/[dominio].api.ts`.
- Nessuna chiamata fetch diretta nei componenti.

### Accessibilità
- Ogni immagine decorativa: `alt=""`; ogni immagine informativa: `alt` descrittivo.
- Form: ogni campo ha il suo `<label>` o `aria-label`.
- Elementi interattivi non-button: `role` e `tabIndex` espliciti.
- Focus visibile sempre presente (non rimuovere `outline` senza alternativa).
- Testare con tastiera prima di considerare un componente completo.

### Multilanguage
- **Libreria**: `next-intl` — integrata con Next.js App Router (server + client components)
- **Lingue supportate**: EN (default), IT, FR, DE — config in `src/layouts/langs-config.ts`
- **File traduzioni**: `messages/{locale}.json` — struttura flat con namespace (`common`, `nav`, `auth`, `errors`, …)
- **Persistenza**: cookie `vabo-lang` (1 anno) — leggibile server-side, nessun flash di hydration al reload
- **Cambio lingua**: imposta cookie + `window.location.reload()` — il server rilancia con il locale corretto
- **Nei componenti**: usare sempre `useTranslations('namespace')` per stringhe client-side; `getTranslations` per server components
- **Hook `useLang()`** in `src/providers/lang-provider` — espone `{ locale, setLocale }` per il language popover
- **Aggiungere una nuova stringa**: aggiungerla in `messages/en.json` e in tutti gli altri file lingua prima di usarla
- I date picker si adattano automaticamente tramite `LocalizationProvider` (AdapterDayjs riceve il locale)

### Zone UI template
- Importare solo: `theme/`, `components/`, `layouts/` — mai `sections/`, `_mock/`, `types/`, demo pages
- Il template è un punto di partenza, non una dipendenza da mantenere aggiornata

### Logo
- File: `/public/brand/icon-192x192.png` — solo questa versione, nessun SVG, nessun wordmark
- Nessuna variante dark/light — il logo è lo stesso in entrambi i temi
- Componente: `src/components/logo/logo.tsx`

### SSL dev
Il server usa certificati mkcert in `certificates/` (non in git).
La cartella va ricreata con: `mkcert local.vabo.tools localhost 127.0.0.1`

## Note Next.js 16
Next.js 16 ha breaking changes rispetto alle versioni precedenti. Leggere `node_modules/next/dist/docs/` prima di usare API che potrebbero essere cambiate.
