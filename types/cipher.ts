/**
 * Contratos compartilhados de cifras (CV-004).
 *
 * ## CipherDefinition<P>
 * Cada cifra expõe um objeto de definição com:
 * - `id`: slug estável (registry, URLs).
 * - `name`: rótulo curto para UI.
 * - `paramFields`: descrição **em runtime** dos campos de parâmetro para formulário
 *   dinâmico (CV-013). Deve refletir o tipo `P` (ex.: campo `shift` quando
 *   `P` é `{ shift: number }`). Cifras sem parâmetros editáveis usam array vazio ou
 *   apenas entradas `kind: "help"` (texto informativo, fora de `parseParams`).
 * - `encode(plainText, params)` / `decode(cipherText, params)`: funções puras;
 *   o mesmo `params` é usado nos dois sentidos.
 *
 * Validação de entradas cruas (JSON de formulário, query string) deve falhar de
 * forma previsível: preferencialmente lançando {@link CipherValidationError}, ou
 * retornando {@link CipherParamsParseResult} quando optar por fluxo sem exceções.
 *
 * Tipos de parâmetro distintos (ex.: número para César, string para Vigenère)
 * ficam explícitos no genérico `P` e nos `paramFields` correspondentes.
 */

export type CipherId = string;

/**
 * Cifra sem parâmetros configuráveis em runtime (`paramFields` vazio).
 * Usamos `unknown` (e não `void`) para ser compatível com registros tipados como
 * {@link CipherDefinition} widened para `unknown` sem conflito de parâmetros em `encode`/`decode`.
 */
export type EmptyCipherParams = unknown;

/** Metadados mínimos para listas / placeholders de UI. */
export type CipherMetadata = {
  readonly id: CipherId;
  readonly name: string;
};

/** Exemplo de `P` para cifras com chave alfabética (ex.: Vigenère). */
export type KeyStringCipherParams = {
  readonly key: string;
};

// --- Descritores de parâmetro (formulário dinâmico) ---

type CipherParamFieldBase = {
  readonly key: string;
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
};

export type CipherParamFieldNumber = CipherParamFieldBase & {
  readonly kind: "number";
  readonly min?: number;
  readonly max?: number;
  /** Se true (default em UI), só inteiros são aceitos na validação. */
  readonly integer?: boolean;
};

export type CipherParamFieldString = CipherParamFieldBase & {
  readonly kind: "string";
  readonly minLength?: number;
  readonly maxLength?: number;
  /** Regex opcional como dica de formato para UI (validar também no parse). */
  readonly pattern?: string;
};

/** Texto só de leitura no formulário; não participa de `cipherParams` nem de `parseParams`. */
export type CipherParamFieldHelp = {
  readonly kind: "help";
  readonly key: string;
  readonly label: string;
  readonly description: string;
};

export type CipherParamField = CipherParamFieldNumber | CipherParamFieldString | CipherParamFieldHelp;

// --- Erros de validação previsíveis ---

export type CipherValidationErrorOptions = {
  readonly code?: string;
  readonly field?: string;
  readonly cause?: unknown;
  /** Contexto extra para a UI (ex.: token Morse inválido). */
  readonly detail?: string;
};

/**
 * Erro lançado quando parâmetros ou texto de entrada violam regras da cifra.
 * `code` estabiliza tratamento por chamadores; `field` alinha com `CipherParamField.key` quando aplicável.
 */
export class CipherValidationError extends Error {
  readonly code: string;
  readonly field?: string;
  readonly detail?: string;

  constructor(message: string, options?: CipherValidationErrorOptions) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "CipherValidationError";
    this.code = options?.code ?? "CIPHER_VALIDATION";
    this.field = options?.field;
    this.detail = options?.detail;
  }
}

export function isCipherValidationError(value: unknown): value is CipherValidationError {
  return value instanceof CipherValidationError;
}

/** Alternativa ao `throw` para parsers de parâmetros (mesmo contrato de erro). */
export type CipherParamsParseResult<P> =
  | { readonly ok: true; readonly value: P }
  | { readonly ok: false; readonly error: CipherValidationError };

/**
 * Estreita o retorno de `parseParams` para {@link CipherParamsParseResult}
 * sem `as`: discrimina por `ok` e valida `value` / instância de {@link CipherValidationError}.
 */
export function isCipherParamsParseResult<P = unknown>(
  value: unknown,
): value is CipherParamsParseResult<P> {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const okTag = Reflect.get(value, "ok");
  if (okTag === true) {
    return Reflect.has(value, "value");
  }
  if (okTag === false) {
    return isCipherValidationError(Reflect.get(value, "error"));
  }
  return false;
}

// --- Definição de cifra ---

export type CipherDefinition<P = EmptyCipherParams> = {
  readonly id: CipherId;
  readonly name: string;
  readonly paramFields: readonly CipherParamField[];
  readonly encode: (plainText: string, params: P) => string;
  readonly decode: (cipherText: string, params: P) => string;
  /**
   * Opcional: normaliza `unknown` (ex.: body JSON) para `P`.
   * Deve lançar {@link CipherValidationError} ou retornar {@link CipherParamsParseResult} conforme a implementação escolher.
   */
  readonly parseParams?: (raw: unknown) => P | CipherParamsParseResult<P>;
};
