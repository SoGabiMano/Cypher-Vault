import {
  CipherValidationError,
  isCipherValidationError,
} from "./cipher";

describe("CipherValidationError", () => {
  it("expõe code, field e detail opcionais", () => {
    const err = new CipherValidationError("bad", {
      code: "TEST",
      field: "shift",
      detail: "x",
    });
    expect(err.message).toBe("bad");
    expect(err.code).toBe("TEST");
    expect(err.field).toBe("shift");
    expect(err.detail).toBe("x");
    expect(err.name).toBe("CipherValidationError");
  });

  it("isCipherValidationError identifica instância", () => {
    expect(isCipherValidationError(new CipherValidationError("x"))).toBe(true);
    expect(isCipherValidationError(new Error("x"))).toBe(false);
    expect(isCipherValidationError("x")).toBe(false);
  });
});
