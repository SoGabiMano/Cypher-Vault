import { cipherRegistry, getAllCiphers, getCipherById } from "./registry";

describe("cipherRegistry", () => {
  it("lista todas as cifras do MVP", () => {
    const ids = cipherRegistry.map((c) => c.id).sort();
    expect(ids).toEqual(["atbash", "caesar", "identity", "morse"]);
  });

  it("getAllCiphers expõe a mesma lista", () => {
    expect(getAllCiphers()).toBe(cipherRegistry);
  });

  it("getCipherById retorna definição ou undefined", () => {
    expect(getCipherById("caesar")?.id).toBe("caesar");
    expect(getCipherById("identity")?.id).toBe("identity");
    expect(getCipherById("missing")).toBeUndefined();
  });

  it("ids são únicos", () => {
    const ids = cipherRegistry.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

