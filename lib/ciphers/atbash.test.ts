import { atbashCipher } from "./atbash";

describe("atbashCipher", () => {
  it("espelha letras ASCII e preserva não-letras", () => {
    const plain = "AbC z! 123 áéí🙂";
    const enc = atbashCipher.encode(plain, undefined);
    expect(enc).toBe("ZyX a! 123 áéí🙂");
    expect(atbashCipher.decode(enc, undefined)).toBe(plain);
  });

  it("exemplo do documento: HELLO -> SVOOL (encode = decode)", () => {
    expect(atbashCipher.encode("HELLO", undefined)).toBe("SVOOL");
    expect(atbashCipher.decode("HELLO", undefined)).toBe("SVOOL");
  });
});

