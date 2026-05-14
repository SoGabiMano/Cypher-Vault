import type { CipherDefinition } from "@/types/cipher";
import { atbashCipher } from "./atbash";
import { caesarCipher } from "./caesar";
import { identityCipher } from "./identity";
import { morseCipher } from "./morse";
import { vigenereCipher } from "./vigenere";

type EnsureUniqueIds<
  T extends readonly { readonly id: string }[],
> = DuplicateId<T> extends infer D
  ? [D] extends [never]
    ? T
    : ["Duplicate cipher id", D & string]
  : never;

type DuplicateId<
  T extends readonly { readonly id: string }[],
  Seen extends readonly string[] = readonly [],
> = T extends readonly [infer H, ...infer R]
  ? H extends { readonly id: infer I extends string }
    ? I extends Seen[number]
      ? I
      : R extends readonly { readonly id: string }[]
        ? DuplicateId<R, readonly [...Seen, I]>
        : never
    : never
  : never;

function defineCipherRegistry<const T extends readonly { readonly id: string }[]>(
  ...ciphers: EnsureUniqueIds<T> & T
): T {
  return ciphers;
}

export const cipherRegistry = defineCipherRegistry(
  atbashCipher,
  caesarCipher,
  identityCipher,
  morseCipher,
  vigenereCipher,
);

/** Ids de cifras só para testes/registry; não aparecem no seletor da UI. */
const SELECTOR_EXCLUDED_IDS = new Set<string>(["identity"]);

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

/** Lista para o seletor da app (exclui helpers como Identity). */
export function getCiphersForSelector(): readonly CipherDefinition<unknown>[] {
  return getAllCiphers().filter((c) => !SELECTOR_EXCLUDED_IDS.has(c.id));
}

export function getCipherById(id: string): CipherDefinition<unknown> | undefined {
  return cipherById.get(id);
}
