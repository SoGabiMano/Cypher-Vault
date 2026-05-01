import { identityCipher } from "./identity";

describe("identityCipher", () => {
  it("preserva texto com params void", () => {
    const t = "hello";
    expect(identityCipher.encode(t, undefined)).toBe(t);
    expect(identityCipher.decode(t, undefined)).toBe(t);
  });

  it("expõe metadados mínimos", () => {
    expect(identityCipher.id).toBe("identity");
    expect(identityCipher.name).toBe("Identity");
    expect(identityCipher.paramFields).toEqual([]);
  });
});
