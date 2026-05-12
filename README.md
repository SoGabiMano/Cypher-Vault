This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Estrutura do código

| Pasta | Uso |
|--------|-----|
| `app/` | Rotas App Router |
| `components/` | UI reutilizável |
| `lib/ciphers/` | Implementações puras das cifras |
| `types/` | Tipos compartilhados (ex.: `cipher.ts`) |

Imports com alias `@/` apontam para a raiz do repositório (`tsconfig.json` → `paths`: `"@/*": ["./*"]`). Exemplo:

```ts
import { PlaceholderNotice } from "@/components/PlaceholderNotice"
```

## Contribuição

- Como adicionar uma nova cifra: [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Scripts úteis

```bash
npm run lint
npm run typecheck
npm run format
npm run format:check
npm test

# (alternativa)
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
pnpm test
```

Testes unitários (Jest): a suíte das cifras fica em `lib/ciphers/*.test.ts` (demais testes em `**/*.test.ts` na raiz). Para modo watch: `npm run test:watch` ou `pnpm test:watch`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
