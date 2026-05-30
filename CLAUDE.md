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
- **Criticità mai posticipate** — ogni criticità di sicurezza o scalabilità individuata va affrontata subito, nello stesso intervento, non rimandata a un "poi". Se per qualche motivo non è risolvibile immediatamente, va comunque scritta come regola esplicita qui (non lasciata implicita o solo a voce).

### Accesso al BE — sempre via BFF
- Il browser non chiama mai direttamente il gateway GraphQL. Tutte le chiamate passano dalla Route Handler same-origin `app/api/graphql/route.ts` (BFF).
- Motivi: niente CORS, URL del gateway fuori dal bundle (`API_URL` server-only, non `NEXT_PUBLIC_`), token Cognito letto dai cookie Amplify SSR lato server (mai maneggiato dal client).
- **Persisted operations**: il client invia solo un `operationId` + variabili; il BFF inoltra esclusivamente query del registro `src/lib/api/graphql-operations.ts`. Nuova operazione = nuova voce nel registro. Mai inoltrare query grezze dal client.
- Il BFF applica: content-type obbligatorio, cap dimensione body, no batching, timeout sul gateway.

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
pnpm sync-env   # Sincronizza .env.local da vabo-be/.sst/outputs.json
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
- **Prima di creare qualsiasi componente, hook, utility o funzionalità**: verificare se esiste già nel template (`/Users/eugenio.ciancimino/Workspace/EMC/templates/Zone_TypeScript_v4.5.1/next-ts/src/`)
- Importare solo: `theme/`, `components/`, `layouts/` — mai `sections/`, `_mock/`, `types/`, demo pages
- Il template è un punto di partenza, non una dipendenza da mantenere aggiornata

### Logo
- File: `/public/brand/icon-192x192.png` — solo questa versione, nessun SVG, nessun wordmark
- Nessuna variante dark/light — il logo è lo stesso in entrambi i temi
- Componente: `src/components/logo/logo.tsx`

### Auth & Routing

**Libreria**: AWS Amplify v6 in SSR mode — token in cookie httpOnly, leggibili server-side.
**Configurazione**: `src/lib/auth/amplify.ts`

**Guard — `src/proxy.ts`** (ex middleware):
- Rotte protette (`/dashboard`, `/settings`, `/profile`): utente non autenticato → redirect `/sign-in?returnTo=<url>`
- Rotte auth (`/sign-in`, `/sign-up`, `/reset-password`, `/update-password`, `/verify`): utente autenticato → redirect `/dashboard`

**Hook `useAuthUser`** — `src/hooks/use-auth-user.ts`:
- Client component only (`"use client"`)
- Carica `getCurrentUser()` + `fetchUserAttributes()` da Amplify
- Ritorna `{ user: AuthUser | null, loading: boolean }`
- `AuthUser`: `{ userId, email, firstName, lastName }`
- Durante il caricamento (`loading: true`) non renderizzare UI condizionale per evitare flash

**`UserButton`** — `src/layouts/components/user-button.tsx`:
- Mostra avatar con iniziali (firstName+lastName, fallback prima lettera email)
- Menu a tendina: nome/email (non cliccabile), link Dashboard, Sign out (colore `error.main`)
- Sostituisce i pulsanti Sign in / Sign up nell'header quando l'utente è autenticato

**Redirect post-login**: dopo `signIn` → `router.push(paths.dashboard)`.

### Form — Field.Password

**Componente**: `src/components/hook-form/rhf-password-field.tsx` — esportato come `Field.Password` via `fields.tsx`.

Props principali:
- `name: string` — nome campo React Hook Form
- `showToggle?: boolean` (default `true`) — toggle visibilità password (icona occhio)
- `showStrength?: boolean` (default `false`) — barra forza 4 segmenti + checklist regole

Uso tipico:
```tsx
// Campo principale (registrazione)
<Field.Password name="password" showToggle showStrength />

// Campo conferma (nessuna forza, nessun toggle)
<Field.Password name="confirmPassword" showToggle={false} />

// Campo login (solo toggle)
<Field.Password name="password" showToggle />
```

Regole strength: lunghezza ≥8, maiuscola, numero, carattere speciale.
Traduzioni nel namespace `auth.strength` di `messages/{locale}.json`.

**Importante**: non usare `solar:close-circle-outline` (non è nella whitelist Iconify). Per l'icona "regola non soddisfatta" usare un `Box` con `borderRadius: '50%'` e `border`.

### SSL dev
Il server usa certificati mkcert in `certificates/` (non in git).
La cartella va ricreata con: `mkcert local.vabo.tools localhost 127.0.0.1`

## Note Next.js 16
Next.js 16 ha breaking changes rispetto alle versioni precedenti. Leggere `node_modules/next/dist/docs/` prima di usare API che potrebbero essere cambiate.
