import { isCipherValidationError } from "@/types/cipher";

/**
 * Códigos `error.code` emitidos por {@link CipherValidationError} na camada de cifras.
 * Ao adicionar um novo `code:` em `lib/ciphers/*`, incluir o literal aqui e a entrada em {@link CODE_MESSAGES}.
 */
type CipherValidationMessageCode =
  | "CIPHER_VALIDATION"
  | "PARAMS_OBJECT"
  | "PARAM_MISSING"
  | "PARAM_TYPE"
  | "PARAM_INTEGER"
  | "PARAM_EMPTY"
  | "PARAM_FORMAT"
  | "MALFORMED_INPUT_DATA";

const CODE_MESSAGES = {
  CIPHER_VALIDATION: "Verifique os dados e tente de novo.",
  PARAMS_OBJECT: "Os parâmetros precisam ser um conjunto simples de campos.",
  PARAM_MISSING: "Preencha todos os campos obrigatórios.",
  PARAM_TYPE: "Um dos campos está em um formato que não reconhecemos.",
  PARAM_INTEGER: "Use um número inteiro para o deslocamento.",
  PARAM_EMPTY: "Este campo não pode ficar vazio.",
  PARAM_FORMAT: "Use apenas letras de A a Z, sem números nem símbolos.",
  MALFORMED_INPUT_DATA: "Uma parte do texto não pôde ser interpretada.",
} as const satisfies Record<CipherValidationMessageCode, string>;

const GENERIC =
  "Não foi possível concluir a operação. Confira a entrada e tente novamente.";

const UNKNOWN_CODE_FALLBACK =
  "Não foi possível validar os dados informados.";

function isCipherValidationMessageCode(
  code: string,
): code is CipherValidationMessageCode {
  return Object.prototype.hasOwnProperty.call(CODE_MESSAGES, code);
}

/**
 * Converte erros da camada de cifras em mensagem curta para o utilizador (PT).
 */
export function formatCipherError(err: unknown): string {
  if (!isCipherValidationError(err)) {
    return GENERIC;
  }

  const base = isCipherValidationMessageCode(err.code)
    ? CODE_MESSAGES[err.code]
    : UNKNOWN_CODE_FALLBACK;

  if (err.code === "MALFORMED_INPUT_DATA" && err.detail !== undefined && err.detail.length > 0) {
    return `${base} Trecho problemático: «${err.detail}».`;
  }

  return base;
}
