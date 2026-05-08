import { CipherValidationError } from "@/types/cipher";
import { decodeMorse, encodeMorse, morseCipher } from "./morse";

describe("morseCipher", () => {
  it("encode SOS e decode retorna lowercase", () => {
    const enc = morseCipher.encode("SOS", undefined);
    expect(enc).toBe("... --- ...");
    expect(morseCipher.decode(enc, undefined)).toBe("sos");
  });

  it("roundtrip em HELLO WORLD com separadores variados", () => {
    const plain = "HELLO WORLD";
    const enc = encodeMorse(plain);
    expect(decodeMorse(enc)).toBe("hello world");

    expect(decodeMorse(enc.replace(" / ", "  "))).toBe("hello world");
    expect(decodeMorse(enc.replace(" / ", "\t"))).toBe("hello world");
    expect(decodeMorse(enc.replace(" / ", "\n"))).toBe("hello world");
    expect(decodeMorse(enc.replace(" / ", "   "))).toBe("hello world");
  });

  it("encode trata qualquer whitespace como separador de palavra", () => {
    expect(encodeMorse("HELLO\tWORLD")).toBe(encodeMorse("HELLO WORLD"));
    expect(encodeMorse("HELLO\nWORLD")).toBe(encodeMorse("HELLO WORLD"));
    expect(encodeMorse("HELLO   WORLD")).toBe(encodeMorse("HELLO WORLD"));
  });

  it("suporta números", () => {
    expect(decodeMorse(encodeMorse("2026"))).toBe("2026");
  });

  it("string vazia é estável", () => {
    expect(encodeMorse("")).toBe("");
    expect(decodeMorse("")).toBe("");
  });

  it("preserva caracteres fora do mapa no encode/decode", () => {
    expect(decodeMorse(encodeMorse("hi!"))).toBe("hi!");
    expect(decodeMorse(encodeMorse("olá"))).toBe("olá");
    expect(decodeMorse(encodeMorse("x-y"))).toBe("x-y");
  });

  it("decode aceita .../... sem espaços", () => {
    expect(decodeMorse(".../...")).toBe("s s");
  });

  it("falha em token morse-like desconhecido", () => {
    expect(() => decodeMorse("..-.-")).toThrow(CipherValidationError);
    try {
      decodeMorse("..-.-");
      throw new Error("expected error");
    } catch (err: unknown) {
      const e = err as CipherValidationError;
      expect(e.code).toBe("MALFORMED_INPUT_DATA");
    }
  });
});

