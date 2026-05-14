import { CipherValidationError } from "@/types/cipher";
import { formatCipherError } from "./formatCipherError";

describe("formatCipherError", () => {
  it("retorna mensagem genérica para erro que não é CipherValidationError", () => {
    expect(formatCipherError(new Error("boom"))).toMatch(/Não foi possível concluir/);
    expect(formatCipherError("x")).toMatch(/Não foi possível concluir/);
    expect(formatCipherError(null)).toMatch(/Não foi possível concluir/);
  });

  it("mapeia códigos conhecidos para português", () => {
    expect(
      formatCipherError(
        new CipherValidationError("x", { code: "PARAM_MISSING", field: "shift" }),
      ),
    ).toMatch(/obrigatórios/);

    expect(
      formatCipherError(
        new CipherValidationError("x", { code: "PARAM_EMPTY", field: "key" }),
      ),
    ).toMatch(/vazio/);

    expect(
      formatCipherError(
        new CipherValidationError("x", { code: "PARAM_FORMAT", field: "key" }),
      ),
    ).toMatch(/A a Z/);
  });

  it("inclui detail em MALFORMED_INPUT_DATA", () => {
    const msg = formatCipherError(
      new CipherValidationError("Malformed", {
        code: "MALFORMED_INPUT_DATA",
        field: "*",
        detail: "..-.-",
      }),
    );
    expect(msg).toContain("Trecho problemático");
    expect(msg).toContain("..-.-");
  });

  it("usa fallback para código desconhecido", () => {
    expect(
      formatCipherError(new CipherValidationError("msg", { code: "UNKNOWN_XYZ" })),
    ).toMatch(/validar/);
  });
});
