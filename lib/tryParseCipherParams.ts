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
    return { ok: true, params: out };
  } catch (e) {
    if (isCipherValidationError(e)) {
      const field = e.field ?? "*";
      return { ok: false, errors: { [field]: format(e) } };
    }
    return { ok: false, errors: { "*": format(e) } };
  }
}
