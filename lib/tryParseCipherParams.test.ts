import { tryParseCipherParams } from "@/lib/tryParseCipherParams";
import type { CipherDefinition } from "@/types/cipher";

describe("tryParseCipherParams", () => {
  it("sem parseParams devolve params undefined", () => {
    const def = {
      id: "x",
      name: "X",
      paramFields: [],
      encode: (t: string) => t,
      decode: (t: string) => t,
    } as const satisfies CipherDefinition<unknown>;

    expect(tryParseCipherParams(def, {})).toEqual({ ok: true, params: undefined });
  });

  it("não relança se parseParams lançar erro genérico", () => {
    const def: CipherDefinition<unknown> = {
      id: "bad",
      name: "Bad",
      paramFields: [],
      encode: (t) => t,
      decode: (t) => t,
      parseParams: () => {
        throw new TypeError("internal");
      },
    };

    const out = tryParseCipherParams(def, {});
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.errors["*"]).toMatch(/Não foi possível concluir/);
    }
  });
});
