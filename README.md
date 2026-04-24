# Cypher Vault

Um app web para **codificar e decodificar texto** usando cifras clássicas (criptografia “de lápis e papel”) — com foco em **aprendizado**, **experimentação** e **extensibilidade** (adicionar novas cifras com facilidade).

## Funcionalidades

- **Codificar** e **decodificar** texto em uma interface simples
- **Seletor de cifra** + formulário de parâmetros (quando a cifra exige chave)
- Base para um **registry** de cifras, facilitando a adição de novos algoritmos

## Cifras suportadas (MVP)

- **Cifra de César** (deslocamento fixo)
- **Atbash** (alfabeto espelhado)
- **Cifra de Vigenère** (deslocamento por palavra‑chave)
- **Código Morse** (mapeamento de caracteres para `.` e `-`)

### Exemplos rápidos

- **César**: `DEV` com chave `3` → `GHY`
- **Atbash**: `HELLO` → `SVOOL`
- **Vigenère**: `CODE` com chave `KEY` → `MSBO`
- **Morse**: `SOS` → `... --- ...`

## Escopo e decisões (MVP)

- **Sem persistência/back-end no MVP** (ex.: Prisma/MongoDB/Express ficam opcionais e só entram com decisão explícita de produto).
- **Alfabeto A–Z (inglês)** como base do MVP.
- Tratamento de **números, espaços e pontuação** pode variar por cifra (ex.: “pass-through” vs “remover”) e deve ser definido por implementação.

## Stack

- **Next.js**
- **TypeScript**
- **Tailwind CSS**

## Como rodar localmente

> Este repositório foi planejado para rodar como app Next.js. Se você acabou de clonar e ainda não há código publicado, esta seção será aplicada após o scaffold inicial.

1. Instale dependências

```bash
npm install
```

2. Rode em modo dev

```bash
npm run dev
```

3. Build de produção

```bash
npm run build
npm start
```

4. Testes (quando configurados)

```bash
npm test
```

## Como adicionar uma nova cifra (checklist)

O objetivo é conseguir adicionar uma cifra sem “costurar” tudo manualmente na UI.

1. **Implemente a cifra** em `lib/ciphers/`

- Exponha funções para **encode** e **decode**
- Garanta um **ID único** para a cifra

2. **Defina/atualize o contrato** em `types/` (ex.: `types/cipher.ts`)

- Nome, descrição, parâmetros (se houver) e validações necessárias

3. **Registre a cifra** no `cipherRegistry`

- A UI deve descobrir cifras pelo registry, não por imports soltos

4. **Adicione testes**

- Use como base exemplos oficiais/documentação (ex.: `DEV`→`GHY`, `HELLO`→`SVOOL`, etc.)

5. **(Se necessário) ajuste a UI**

- Se a cifra tiver parâmetros (chave numérica, palavra‑chave…), garanta que o formulário seja gerado a partir do contrato/registry

## Deploy

- Recomendado: **Vercel** (deploy padrão de Next.js)
- Após publicação, inclua aqui a **URL pública/staging**

## Roadmap (alto nível)

- **M1**: Fundação do repositório (Next + TS + Tailwind + lint + estrutura)
- **M2**: Núcleo de cifras + testes + contrato/registry
- **M3**: UI integrada (seletor, parâmetros dinâmicos, validação)
- **M4**: Qualidade e entrega (A11y, mobile, README, deploy) — **deadline: 17/05/2026**
