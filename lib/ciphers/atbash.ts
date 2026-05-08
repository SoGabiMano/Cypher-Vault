import type { CipherDefinition, EmptyCipherParams } from "@/types/cipher";

const ASCII_UPPER_A = 65;
const ASCII_UPPER_Z = 90;
const ASCII_LOWER_A = 97;
const ASCII_LOWER_Z = 122;

function mirrorAsciiLetter(code: number, baseA: number, baseZ: number): number {
  return baseZ - (code - baseA);
}

function transform(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) {
      out += ch;
      continue;
    }

    if (ch.length === 1 && code >= ASCII_UPPER_A && code <= ASCII_UPPER_Z) {
      out += String.fromCodePoint(mirrorAsciiLetter(code, ASCII_UPPER_A, ASCII_UPPER_Z));
      continue;
    }

    if (ch.length === 1 && code >= ASCII_LOWER_A && code <= ASCII_LOWER_Z) {
      out += String.fromCodePoint(mirrorAsciiLetter(code, ASCII_LOWER_A, ASCII_LOWER_Z));
      continue;
    }

    out += ch;
  }
  return out;
}

/**
 * Atbash (A↔Z, B↔Y, …) apenas sobre A–Z / a–z.
 *
 * Regras:
 * - transforma somente letras ASCII latinas (A–Z, a–z)
 * - preserva qualquer outro caractere (pontuação, números, acentos, emojis, etc.)
 * - encode e decode são a mesma operação
 */
export const atbashCipher = {
  id: "atbash",
  name: "Atbash",
  paramFields: [],
  encode: (plainText, params) => {
    void params;
    return transform(plainText);
  },
  decode: (cipherText, params) => {
    void params;
    return transform(cipherText);
  },
} as const satisfies CipherDefinition<EmptyCipherParams>;

