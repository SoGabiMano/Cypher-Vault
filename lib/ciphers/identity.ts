import type { CipherDefinition, EmptyCipherParams } from "@/types/cipher";

/** Cifra identidade: útil para testes de registry e smoke de imports `lib/ciphers/*`. */
export const identityCipher = {
  id: "identity",
  name: "Identity",
  paramFields: [],
  encode: (plainText, params) => {
    void params;
    return plainText;
  },
  decode: (cipherText, params) => {
    void params;
    return cipherText;
  },
} as const satisfies CipherDefinition<EmptyCipherParams>;
