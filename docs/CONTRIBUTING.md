# Contribuindo com novas cifras

Este guia descreve o fluxo completo para adicionar uma nova cifra em `lib/ciphers/`, incluindo contrato de tipos, testes, registro no `cipherRegistry` e ajustes de UI quando houver novos parametros.

## Visao geral

Cada cifra precisa:

- Implementar o contrato `CipherDefinition<P>` de `types/cipher.ts`.
- Expor `id` unico, `name`, `paramFields`, `encode` e `decode`.
- Opcionalmente implementar `parseParams` para validar entrada crua com `CipherValidationError`.
- Ser registrada em `lib/ciphers/registry.ts`.
- Ter testes para parser e comportamento da cifra.

## Pre-requisitos

Antes de implementar:

1. Leia `types/cipher.ts` e confirme o tipo de parametros `P` da sua cifra.
2. Defina `id` estavel (slug sem espacos), usado por registry e por fluxos de UI.
3. Planeje os `paramFields` para refletirem exatamente os parametros aceitos por `parseParams`.
4. Se a cifra nao tiver parametros, use `EmptyCipherParams` e `paramFields: []`.

## Passo a passo (checklist)

1. Crie `lib/ciphers/<nome-da-cifra>.ts` exportando:
   - tipo de parametros (ex.: `MyCipherParams`);
   - parser (ex.: `parseMyCipherParams(raw: unknown)`);
   - objeto `myCipher` com `satisfies CipherDefinition<MyCipherParams>`.
2. Implemente `encode` e `decode` como funcoes puras (sem estado global, sem I/O).
3. Se houver parametros, valide em `parseParams` com erros previsiveis via `CipherValidationError`.
4. Adicione os metadados de formulario em `paramFields` (`kind`, `key`, `label`, regras).
5. Registre a cifra em `lib/ciphers/registry.ts` dentro de `defineCipherRegistry(...)`.
6. Exporte a cifra em `lib/ciphers/index.ts`.
7. Crie testes em `lib/ciphers/<nome-da-cifra>.test.ts` cobrindo:
   - parser aceitando entrada valida;
   - parser rejeitando entradas invalidas;
   - roundtrip (`decode(encode(texto)) === texto`) quando aplicavel.
8. Se a cifra introduzir novos parametros ou comportamento de entrada, valide impacto na UI de parametros dinamicos (CV-013), garantindo que os `paramFields` sejam suficientes para renderizar/validar o formulario.
9. Rode verificacoes locais:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run format:check`

## Exemplo pratico (referencia: Caesar)

Use `lib/ciphers/caesar.ts` como modelo:

- `CaesarParams` define `{ shift: number }`.
- `parseCaesarParams` valida objeto, presenca de `shift`, numero finito e inteiro.
- `paramFields` declara um campo numerico obrigatorio com `integer: true`.
- `encode` e `decode` reutilizam uma funcao interna pura (`transform`).

E valide o padrao de teste em `lib/ciphers/caesar.test.ts`.

## Criterios de pronto para PR

- Nova cifra aparece em `getAllCiphers()` e `getCipherById("<id>")`.
- IDs no registry continuam unicos.
- Testes da cifra e do registry permanecem verdes.
- Documentacao e nomes seguem o padrao existente do projeto.
