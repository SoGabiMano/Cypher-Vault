import { CipherValidationError } from "@/types/cipher";
import { caesarCipher, parseCaesarParams } from "./caesar";

describe("parseCaesarParams", () => {
  it("aceita objeto com shift inteiro", () => {
    expect(parseCaesarParams({ shift: 3 })).toEqual({ shift: 3 });
  });

  it("rejeita não-objeto", () => {
    expect(() => parseCaesarParams(null)).toThrow(CipherValidationError);
  });

  it("rejeita shift ausente", () => {
    expect(() => parseCaesarParams({})).toThrow(CipherValidationError);
  });

  it("rejeita shift não inteiro", () => {
    expect(() => parseCaesarParams({ shift: 1.5 })).toThrow(CipherValidationError);
  });
});

describe("caesarCipher", () => {
  it("roundtrip em letras ASCII", () => {
    const params = { shift: 3 };
    const plain = "AbC z!";
    const enc = caesarCipher.encode(plain, params);
    expect(enc).toBe("DeF c!");
    expect(caesarCipher.decode(enc, params)).toBe(plain);
  });

  it("parseParams está disponível na definição", () => {
    expect(caesarCipher.parseParams).toBe(parseCaesarParams);
  });
});
