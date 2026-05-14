import { formatCipherError } from "@/lib/formatCipherError";
import {
  isCipherParamsParseResult,
  isCipherValidationError,
  type CipherDefinition,
} from "@/types/cipher";

export type TryParseCipherParamsResult =
  | { readonly ok: true; readonly params: unknown }
  | { readonly ok: false; readonly errors: Record<string, string> };

export function tryParseCipherParams(
  definition: CipherDefinition<unknown> | undefined,
  raw: Record<string, unknown>,
): TryParseCipherParamsResult {
  if (!definition?.parseParams) {
    return { ok: true, params: undefined };
  }

  const format = (e: unknown) => formatCipherError(e);

  try {
    const out = definition.parseParams(raw);
    if (isCipherParamsParseResult(out)) {
      if (!out.ok) {
        const e = out.error;
        const field = e.field ?? "*";
        return { ok: false, errors: { [field]: format(e) } };
      }
      return { ok: true, params: out.value };
    }
    // `ok: false` sem `error` tipado como CipherValidationError falha em
    // `isCipherParamsParseResult`, mas ainda deve ser tratado como falha.
    if (out !== null && typeof out === "object" && Reflect.get(out, "ok") === false) {
      const err = Reflect.get(out, "error");
      const field = isCipherValidationError(err) ? (err.field ?? "*") : "*";
      return { ok: false, errors: { [field]: format(err) } };
    }
    return { ok: true, params: out };
  } catch (e) {
    if (isCipherValidationError(e)) {
      const field = e.field ?? "*";
      return { ok: false, errors: { [field]: format(e) } };
    }
    return { ok: false, errors: { "*": format(e) } };
  }
}
