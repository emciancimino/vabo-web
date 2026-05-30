import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Codice del template Zone (acquistato): non lo modifichiamo né lo sottoponiamo
    // alle nostre regole di lint. Il lint sorveglia solo il codice del progetto
    // (app/, sections/, lib/, hooks/, providers/, routes/, utils/).
    // Se in futuro aggiungiamo componenti NOSTRI sotto components/, carvarli fuori
    // da questi ignore (es. components/ui/**, components/<feature>/**).
    "src/components/**",
    "src/layouts/**",
    "src/theme/**",
  ]),
]);

export default eslintConfig;
