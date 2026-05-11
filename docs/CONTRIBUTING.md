# Contribuindo com novas cifras

Este guia descreve o fluxo completo para adicionar uma nova cifra em `lib/ciphers/`, incluindo contrato de tipos, testes, registro no `cipherRegistry` e ajustes de UI quando houver novos parâmetros.

**Índice**

- [Visão geral](#visao-geral)
- [Pré-requisitos](#pre-requisitos)
- [Checklist](#checklist)
- [Exemplo](#exemplo)
- [Critérios](#criterios)

<a id="visao-geral"></a>

## Visão geral

Cada cifra precisa:

- Implementar o contrato `CipherDefinition<P>` de `types/cipher.ts`.
- Expor `id` único, `name`, `paramFields`, `encode` e `decode`.
- Opcionalmente implementar `parseParams` para validar entrada crua com `CipherValidationError`.
- Ser registrada em `lib/ciphers/registry.ts`.
- Ter testes para parser e comportamento da cifra.

<a id="pre-requisitos"></a>

## Pré-requisitos

Antes de implementar:

1. Leia `types/cipher.ts` e confirme o tipo de parâmetros `P` da sua cifra.
2. Defina `id` estável (slug sem espaços), usado por registry e por fluxos de UI.
3. Planeje os `paramFields` para refletirem exatamente os parâmetros aceitos por `parseParams`.
4. Se a cifra não tiver parâmetros, use `EmptyCipherParams` e `paramFields: []`.

<a id="checklist"></a>

## Checklist

1. Crie `lib/ciphers/<nome-da-cifra>.ts` exportando:
   - tipo de parâmetros (ex.: `MyCipherParams`);
   - parser (ex.: `parseMyCipherParams(raw: unknown)`);
   - objeto `myCipher` com `satisfies CipherDefinition<MyCipherParams>`.
2. Implemente `encode` e `decode` como funções puras (sem estado global, sem I/O).
3. Se houver parâmetros, valide em `parseParams` com erros previsíveis via `CipherValidationError`.
4. Adicione os metadados de formulário em `paramFields` (`kind`, `key`, `label`, regras).
5. Registre a cifra em `lib/ciphers/registry.ts` dentro de `defineCipherRegistry(...)`.
6. Exporte a cifra em `lib/ciphers/index.ts`.
7. Crie testes em `lib/ciphers/<nome-da-cifra>.test.ts` cobrindo:
   - parser aceitando entrada válida;
   - parser rejeitando entradas inválidas;
   - roundtrip (`decode(encode(texto)) === texto`) quando aplicável.
8. Se a cifra introduzir novos parâmetros ou comportamento de entrada, valide impacto na UI de parâmetros dinâmicos (CV-013), garantindo que os `paramFields` sejam suficientes para renderizar/validar o formulário.
9. Rode verificações locais:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run format:check`

<a id="exemplo"></a>

## Exemplo prático (Caesar)

Use `lib/ciphers/caesar.ts` como modelo:

- `CaesarParams` define `{ shift: number }`.
- `parseCaesarParams` valida objeto, presença de `shift`, número finito e inteiro.
- `paramFields` declara um campo numérico obrigatório com `integer: true`.
- `encode` e `decode` reutilizam uma função interna pura (`transform`).

E valide o padrão de teste em `lib/ciphers/caesar.test.ts`.

<a id="criterios"></a>

## Critérios de pronto para PR

- Nova cifra aparece em `getAllCiphers()` e `getCipherById("<id>")`.
- IDs no registry continuam únicos.
- Testes da cifra e do registry permanecem verdes.
- Documentação e nomes seguem o padrão existente do projeto.
