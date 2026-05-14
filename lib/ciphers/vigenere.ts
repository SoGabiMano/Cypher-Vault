import { CipherValidationError, type CipherDefinition, type KeyStringCipherParams } from "@/types/cipher";

export type VigenereParams = KeyStringCipherParams;

const ALPHABET_SIZE = 26;

function isAsciiUpperLetter(code: number): boolean {
  return code >= 65 && code <= 90;
}

function isAsciiLowerLetter(code: number): boolean {
  return code >= 97 && code <= 122;
}

function shiftLetter(code: number, base: number, shift: number): number {
  const i = code - base;
  const j = (i + shift) % ALPHABET_SIZE;
  return base + (j < 0 ? j + ALPHABET_SIZE : j);
}

function normalizeKey(rawKey: string): string {
  const key = rawKey.trim();
  if (key.length === 0) {
    throw new CipherValidationError('"key" cannot be empty.', {
      code: "PARAM_EMPTY",
      field: "key",
    });
  }

  if (!/^[A-Za-z]+$/.test(key)) {
    throw new CipherValidationError('"key" must contain only letters A–Z.', {
      code: "PARAM_FORMAT",
      field: "key",
    });
  }

  return key.toUpperCase();
}

export function parseVigenereParams(raw: unknown): VigenereParams {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new CipherValidationError("Parameters must be a plain object.", {
      code: "PARAMS_OBJECT",
      field: "*",
    });
  }
  const rec = raw as Record<string, unknown>;

  // Aceita também "keyword" como alias (por compatibilidade com a linguagem da issue).
  const keyRaw = (rec.key ?? rec.keyword) as unknown;
  if (keyRaw === undefined) {
    throw new CipherValidationError('Missing required field "key".', {
      code: "PARAM_MISSING",
      field: "key",
    });
  }
  if (typeof keyRaw !== "string") {
    throw new CipherValidationError('"key" must be a string.', {
      code: "PARAM_TYPE",
      field: "key",
    });
  }

  return { key: normalizeKey(keyRaw) };
}

function transform(text: string, key: string, decrypt: boolean): string {
  let out = "";
  let keyIndex = 0;

  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) {
      out += ch;
      continue;
    }

    if (ch.length === 1 && (isAsciiUpperLetter(code) || isAsciiLowerLetter(code))) {
      const k = key.codePointAt(keyIndex % key.length);
      // key é sempre A–Z após normalizeKey, então k não deve ser undefined.
      const shift = k === undefined ? 0 : k - 65;
      const delta = decrypt ? -shift : shift;
      const base = isAsciiUpperLetter(code) ? 65 : 97;
      out += String.fromCodePoint(shiftLetter(code, base, delta));
      keyIndex += 1;
      continue;
    }

    out += ch;
  }

  return out;
}

/**
 * Vigenère em letras ASCII (A–Z / a–z).
 *
 * - `key` aceita A–Z (case-insensitive) e é normalizada para uppercase.
 * - Caracteres não-letra são preservados e **não** avançam o índice da key.
 */
export const vigenereCipher = {
  id: "vigenere",
  name: "Vigenère",
  paramFields: [
    {
      kind: "string",
      key: "key",
      label: "Palavra-chave",
      description: "Apenas letras A–Z (maiúsculas ou minúsculas).",
      required: true,
      minLength: 1,
      pattern: "^[A-Za-z]+$",
    },
  ],
  encode: (plainText, params) => transform(plainText, params.key, false),
  decode: (cipherText, params) => transform(cipherText, params.key, true),
  parseParams: parseVigenereParams,
} as const satisfies CipherDefinition<VigenereParams>;

