import { isCipherValidationError } from "@/types/cipher";

const CODE_MESSAGES: Readonly<Record<string, string>> = {
  PARAMS_OBJECT: "Os parâmetros precisam ser um conjunto simples de campos.",
  PARAM_MISSING: "Preencha todos os campos obrigatórios.",
  PARAM_TYPE: "Um dos campos está em um formato que não reconhecemos.",
  PARAM_INTEGER: "Use um número inteiro para o deslocamento.",
  PARAM_EMPTY: "Este campo não pode ficar vazio.",
  PARAM_FORMAT: "Use apenas letras de A a Z, sem números nem símbolos.",
  MALFORMED_INPUT_DATA: "Uma parte do texto não pôde ser interpretada.",
  CIPHER_VALIDATION: "Verifique os dados e tente de novo.",
};

const GENERIC =
  "Não foi possível concluir a operação. Confira a entrada e tente novamente.";

/**
 * Converte erros da camada de cifras em mensagem curta para o utilizador (PT).
 */
export function formatCipherError(err: unknown): string {
  if (!isCipherValidationError(err)) {
    return GENERIC;
  }

  const base = CODE_MESSAGES[err.code] ?? "Não foi possível validar os dados informados.";

  if (err.code === "MALFORMED_INPUT_DATA" && err.detail !== undefined && err.detail.length > 0) {
    return `${base} Trecho problemático: «${err.detail}».`;
  }

  return base;
}
