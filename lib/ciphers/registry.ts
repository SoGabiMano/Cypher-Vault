import type { CipherDefinition } from "@/types/cipher";
import { atbashCipher } from "./atbash";
import { caesarCipher } from "./caesar";
import { identityCipher } from "./identity";
import { morseCipher } from "./morse";
import { vigenereCipher } from "./vigenere";

export const cipherRegistry = [atbashCipher, caesarCipher, identityCipher, morseCipher, vigenereCipher] as const;
const cipherById: ReadonlyMap<string, CipherDefinition<unknown>> = (() => {
  const map = new Map<string, CipherDefinition<unknown>>();
  for (const def of cipherRegistry) {
    if (map.has(def.id)) {
      throw new Error(`Duplicate cipher id detected: "${def.id}"`);
    }
    map.set(def.id, def as unknown as CipherDefinition<unknown>);
  }
  return map;
})();

export function getAllCiphers(): readonly CipherDefinition<unknown>[] {
  return cipherRegistry as unknown as readonly CipherDefinition<unknown>[];
}

export function getCipherById(id: string): CipherDefinition<unknown> | undefined {
  return cipherById.get(id);
}

