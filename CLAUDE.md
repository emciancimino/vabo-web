# vabo-web — Frontend Guide

## Stack
- **Framework**: Next.js 16 (App Router) — React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Package manager**: pnpm

## Key Commands
```bash
pnpm dev        # Dev server (HTTPS locale)
pnpm build      # Production build
pnpm lint       # ESLint
```

## Project Structure
```
src/
  app/                  # Next.js App Router: pages, layouts, route segments
  components/
    ui/                 # Primitivi riutilizzabili (Button, Input, Badge…)
    layout/             # Struttura pagina (Navbar, Footer, Sidebar…)
    [feature]/          # Componenti domain-specific (feed/, profile/, publish/…)
  hooks/                # Custom React hooks
  lib/
    api/                # Funzioni di chiamata API, una per dominio (profile.api.ts)
  types/                # TypeScript types e interfaces condivise (usate in >1 file)
  providers/            # React Context providers
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

### Export
- **Nessun `default export`** tranne nei file `page.tsx` e `layout.tsx` (Next.js lo richiede).
- Tutti gli altri file usano named exports.

### Import Alias
- L'alias `@/` punta a `src/`. Usarlo sempre negli import invece di path relativi profondi.
  ```ts
  // ✅
  import { UserAvatar } from "@/components/ui/user-avatar";
  // ❌
  import { UserAvatar } from "../../../components/ui/user-avatar";
  ```

### Types
- Se un tipo è usato in **un solo file**, definirlo inline nello stesso file.
- Se è usato in **più di un file**, spostarlo in `src/types/`.

### Componenti
- Un componente per file.
- Props type definito nello stesso file, sopra la funzione, con il nome `[ComponentName]Props`.
  ```ts
  type UserAvatarProps = { src: string; alt: string };
  export function UserAvatar({ src, alt }: UserAvatarProps) { … }
  ```

### Server vs Client Components
- Default: **Server Component** (nessun `"use client"`).
- Aggiungere `"use client"` solo se il componente usa hooks, eventi, o stato client-side.
- Isolare la logica client nel componente più piccolo possibile.

### API Calls
- Tutte le chiamate al BE vivono in `src/lib/api/[dominio].api.ts`.
- Nessuna chiamata fetch diretta nei componenti.

## Note Next.js 16
Next.js 16 ha breaking changes rispetto alle versioni precedenti. Leggere `node_modules/next/dist/docs/` prima di usare API che potrebbero essere cambiate.
