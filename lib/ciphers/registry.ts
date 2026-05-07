import type { CipherDefinition } from "@/types/cipher";
import { atbashCipher } from "./atbash";
import { caesarCipher } from "./caesar";
import { identityCipher } from "./identity";

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

function defineCipherRegistry<const T extends readonly CipherDefinition<unknown>[]>(
  ...ciphers: EnsureUniqueIds<T> & T
): T {
  return ciphers;
}

export const cipherRegistry = defineCipherRegistry(
  atbashCipher,
  caesarCipher,
  identityCipher,
);

const cipherById: ReadonlyMap<string, CipherDefinition<unknown>> = (() => {
  const map = new Map<string, CipherDefinition<unknown>>();
  for (const def of cipherRegistry) {
    if (map.has(def.id)) {
      throw new Error(`Duplicate cipher id detected: "${def.id}"`);
    }
    map.set(def.id, def);
  }
  return map;
})();

export function getAllCiphers(): readonly CipherDefinition<unknown>[] {
  return cipherRegistry;
}

export function getCipherById(id: string): CipherDefinition<unknown> | undefined {
  return cipherById.get(id);
}

