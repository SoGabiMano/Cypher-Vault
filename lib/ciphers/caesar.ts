import { CipherValidationError, type CipherDefinition } from "@/types/cipher";

export type CaesarParams = {
  readonly shift: number;
};

const ALPHABET_SIZE = 26;

function shiftLetter(code: number, base: number, shift: number): number {
  const i = code - base;
  const j = (i + shift) % ALPHABET_SIZE;
  return base + (j < 0 ? j + ALPHABET_SIZE : j);
}

function transform(text: string, shift: number, decrypt: boolean): string {
  const delta = decrypt ? -shift : shift;
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) {
      out += ch;
      continue;
    }
    if (ch.length === 1 && code >= 65 && code <= 90) {
      out += String.fromCodePoint(shiftLetter(code, 65, delta));
      continue;
    }
    if (ch.length === 1 && code >= 97 && code <= 122) {
      out += String.fromCodePoint(shiftLetter(code, 97, delta));
      continue;
    }
    out += ch;
  }
  return out;
}

export function parseCaesarParams(raw: unknown): CaesarParams {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new CipherValidationError("Parameters must be a plain object.", {
      code: "PARAMS_OBJECT",
      field: "*",
    });
  }
  const rec = raw as Record<string, unknown>;
  if (!("shift" in rec)) {
    throw new CipherValidationError('Missing required field "shift".', {
      code: "PARAM_MISSING",
      field: "shift",
    });
  }
  const shift = rec.shift;
  if (typeof shift !== "number" || !Number.isFinite(shift)) {
    throw new CipherValidationError('"shift" must be a finite number.', {
      code: "PARAM_TYPE",
      field: "shift",
    });
  }
  if (!Number.isInteger(shift)) {
    throw new CipherValidationError('"shift" must be an integer.', {
      code: "PARAM_INTEGER",
      field: "shift",
    });
  }
  return { shift };
}

/** César apenas sobre A–Z / a–z; demais code points são preservados. */
export const caesarCipher: CipherDefinition<CaesarParams> = {
  id: "caesar",
  name: "Caesar",
  paramFields: [
    {
      kind: "number",
      key: "shift",
      label: "Shift",
      description: "Integer rotation for Latin letters A–Z and a–z.",
      required: true,
      integer: true,
    },
  ],
  encode: (plainText, params) => transform(plainText, params.shift, false),
  decode: (cipherText, params) => transform(cipherText, params.shift, true),
  parseParams: parseCaesarParams,
};
