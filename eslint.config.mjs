/**
 * Lint + formatação:
 * - ESLint (flat config) com presets Next.js; `eslint-config-prettier` só desliga regras do ESLint
 *   que brigam com o Prettier — sem `eslint-plugin-prettier` no lint, para não rodar o formatador
 *   dentro do ESLint (lint continua rápido; formatação fica nos scripts `format` / `format:check`).
 * - Prettier: dependência + scripts no `package.json`; opções ficam em `.prettierrc.json` / `.prettierignore`,
 *   e não em um bloco `"prettier"` duplicado no `package.json`, para uma única fonte de verdade
 *   compartilhada entre CLI, CI e editor.
 */
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
