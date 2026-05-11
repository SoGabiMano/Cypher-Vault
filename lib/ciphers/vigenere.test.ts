import { CipherValidationError } from "@/types/cipher";
import { parseVigenereParams, vigenereCipher } from "./vigenere";

describe("parseVigenereParams", () => {
  it("aceita objeto com key e normaliza para uppercase", () => {
    expect(parseVigenereParams({ key: "kEy" })).toEqual({ key: "KEY" });
  });

  it("aceita objeto com keyword (alias) e normaliza para uppercase", () => {
    expect(parseVigenereParams({ keyword: "key" })).toEqual({ key: "KEY" });
  });

  it("rejeita não-objeto", () => {
    expect(() => parseVigenereParams(null)).toThrow(CipherValidationError);
  });

  it("rejeita key ausente", () => {
    expect(() => parseVigenereParams({})).toThrow(CipherValidationError);
  });

  it("rejeita key vazia", () => {
    expect(() => parseVigenereParams({ key: "   " })).toThrow(CipherValidationError);
  });

  it("rejeita key com caracteres inválidos", () => {
    expect(() => parseVigenereParams({ key: "KE-Y" })).toThrow(CipherValidationError);
    expect(() => parseVigenereParams({ key: "K3Y" })).toThrow(CipherValidationError);
  });
});

describe("vigenereCipher", () => {
  it("exemplo cypher-vault-ideia (Vigenère): CODE + KEY -> MSBO", () => {
    const params = { key: "KEY" };
    expect(vigenereCipher.encode("CODE", params)).toBe("MSBO");
    expect(vigenereCipher.decode("MSBO", params)).toBe("CODE");
  });

  it("preserva não-letras e não avança key nelas", () => {
    const params = { key: "A" }; // shift 0, efeito visual só para avançar key
    expect(vigenereCipher.encode("A A!", params)).toBe("A A!");
  });

  it("roundtrip preserva case e pontuação", () => {
    const params = { key: "Key" }; // parseParams normaliza; encode/decode usa key direto
    const parsed = parseVigenereParams({ key: params.key });
    const plain = "AbC z!";
    const enc = vigenereCipher.encode(plain, parsed);
    expect(vigenereCipher.decode(enc, parsed)).toBe(plain);
  });

  it("parseParams está disponível na definição", () => {
    expect(vigenereCipher.parseParams).toBe(parseVigenereParams);
  });
});

