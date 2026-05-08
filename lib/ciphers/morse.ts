import { CipherValidationError, type CipherDefinition, type EmptyCipherParams } from "@/types/cipher";

const MORSE_BY_CHAR: Readonly<Record<string, string>> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
} as const;

const CHAR_BY_MORSE: Readonly<Record<string, string>> = (() => {
  const out: Record<string, string> = {};
  for (const [ch, morse] of Object.entries(MORSE_BY_CHAR)) {
    out[morse] = ch;
  }
  return out;
})();

function isWhitespaceChar(ch: string): boolean {
  return ch.trim().length === 0;
}

function isMorseLikeToken(token: string): boolean {
  if (token.length === 0) return false;
  for (const ch of token) {
    if (ch !== "." && ch !== "-") return false;
  }
  return true;
}

function escapeLiteralToken(token: string): string {
  return `\\${token}`;
}

function encodeWord(word: string): string {
  const tokens: string[] = [];
  for (const ch of word) {
    const key = ch.toLowerCase();
    const morse = MORSE_BY_CHAR[key];
    if (morse !== undefined) {
      tokens.push(morse);
      continue;
    }
    // Disambiguate literal characters that would otherwise be parsed as morse.
    if (ch === "." || ch === "-" || ch === "/") {
      tokens.push(escapeLiteralToken(ch));
      continue;
    }
    tokens.push(ch);
  }
  return tokens.join(" ");
}

export function encodeMorse(plainText: string): string {
  const words: string[] = [];
  let current = "";

  for (const ch of plainText) {
    if (isWhitespaceChar(ch)) {
      if (current.length > 0) {
        words.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }

  if (current.length > 0) {
    words.push(current);
  }

  return words.map(encodeWord).join(" / ");
}

type Token = { readonly kind: "token"; readonly value: string } | { readonly kind: "wordSep" };

function tokenizeMorseInput(input: string): readonly Token[] {
  const tokens: Token[] = [];
  let buffer = "";
  let whitespaceCount = 0;

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    tokens.push({ kind: "token", value: buffer });
    buffer = "";
  };

  const flushWhitespace = () => {
    if (whitespaceCount >= 2) {
      tokens.push({ kind: "wordSep" });
    }
    whitespaceCount = 0;
  };

  for (const ch of input) {
    if (ch === "/") {
      flushBuffer();
      whitespaceCount = 0;
      tokens.push({ kind: "wordSep" });
      continue;
    }
    if (isWhitespaceChar(ch)) {
      flushBuffer();
      // Tabs/newlines should behave like word separators (tolerant decode).
      if (ch !== " ") {
        flushWhitespace();
        tokens.push({ kind: "wordSep" });
        whitespaceCount = 0;
        continue;
      }
      whitespaceCount += 1;
      continue;
    }
    flushWhitespace();
    buffer += ch;
  }

  flushBuffer();
  flushWhitespace();

  return tokens;
}

export function decodeMorse(cipherText: string): string {
  const parts = tokenizeMorseInput(cipherText);

  let out = "";
  let pendingSpace = false;

  for (const part of parts) {
    if (part.kind === "wordSep") {
      if (out.length > 0) {
        pendingSpace = true;
      }
      continue;
    }

    const token = part.value;
    if (token.startsWith("\\") && token.length >= 2) {
      const literal = token.slice(1);
      if (pendingSpace) {
        out += " ";
        pendingSpace = false;
      }
      out += literal;
      continue;
    }
    const decoded = CHAR_BY_MORSE[token];
    if (decoded !== undefined) {
      if (pendingSpace) {
        out += " ";
        pendingSpace = false;
      }
      out += decoded;
      continue;
    }

    if (isMorseLikeToken(token)) {
      throw new CipherValidationError('Malformed morse token in input.', {
        code: "MALFORMED_INPUT_DATA",
        field: "*",
      });
    }

    if (pendingSpace) {
      out += " ";
      pendingSpace = false;
    }
    out += token;
  }

  return out.toLowerCase();
}

export const morseCipher = {
  id: "morse",
  name: "Morse",
  paramFields: [],
  encode: (plainText, params) => {
    void params;
    return encodeMorse(plainText);
  },
  decode: (cipherText, params) => {
    void params;
    return decodeMorse(cipherText);
  },
} as const satisfies CipherDefinition<EmptyCipherParams>;

