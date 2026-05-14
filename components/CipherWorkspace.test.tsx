import { render, screen, fireEvent } from "@testing-library/react";
import { getAllCiphers } from "@/lib/ciphers";
import { applyCipherSelectionChange } from "./applyCipherSelectionChange";
import { CipherWorkspace } from "./CipherWorkspace";

describe("CipherWorkspace", () => {
  it("marca o resultado como região live para atualizações serem anunciadas ao AT", () => {
    render(<CipherWorkspace />);
    const output = screen.getByLabelText("Resultado");
    expect(output).toHaveAttribute("aria-live", "polite");
    expect(output).toHaveAttribute("aria-atomic", "true");
  });

  it("desabilita Codificar e Decodificar quando a entrada está vazia", () => {
    render(<CipherWorkspace />);
    expect(screen.getByRole("button", { name: "Codificar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decodificar" })).toBeDisabled();
  });

  it("desabilita as ações quando a entrada só tem espaços em branco após trim", () => {
    render(<CipherWorkspace />);
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "   \t\n  " },
    });
    expect(screen.getByRole("button", { name: "Codificar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decodificar" })).toBeDisabled();
  });

  it("Codificar coloca o resultado em maiúsculas", () => {
    render(<CipherWorkspace />);
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "abc def" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Codificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("ABC DEF");
  });

  it("Decodificar coloca o resultado em minúsculas", () => {
    render(<CipherWorkspace />);
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "ABC DEF" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Decodificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("abc def");
  });

  it("limpa o resultado quando a entrada fica vazia ou só com espaços após trim", () => {
    render(<CipherWorkspace />);
    const input = screen.getByLabelText("Texto de entrada");
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: "Codificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("HI");

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByLabelText("Resultado")).toHaveValue("");

    fireEvent.change(input, { target: { value: "   \t" } });
    expect(screen.getByLabelText("Resultado")).toHaveValue("");
  });

  it("lista todas as cifras do registry no seletor", () => {
    render(<CipherWorkspace />);

    const expectedNames = getAllCiphers().map((cipher) => cipher.name);
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(expectedNames.length);
    expect(options.map((option) => option.textContent)).toEqual(expectedNames);
  });

  it("mantém o comportamento mock de Codificar após trocar a cifra", () => {
    render(<CipherWorkspace />);

    const ciphers = getAllCiphers();
    const nextCipher =
      ciphers.find((c) => c.id === "identity") ?? ciphers.find((c) => c.id === "morse") ?? ciphers[0];

    fireEvent.change(screen.getByLabelText("Cifra"), {
      target: { value: nextCipher.id },
    });
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "abc def" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Codificar" }));

    expect(screen.getByLabelText("Resultado")).toHaveValue("ABC DEF");
  });

  describe("troca de cifra", () => {
    it("zera parâmetros previamente preenchidos", () => {
      expect(
        applyCipherSelectionChange(
          { selectedCipherId: "atbash", cipherParams: { shift: 3 } },
          "caesar",
        ),
      ).toEqual({
        selectedCipherId: "caesar",
        cipherParams: {},
      });
    });

    it("mantém o estado quando a cifra selecionada não muda", () => {
      const state = { selectedCipherId: "caesar", cipherParams: { shift: 3 } };

      expect(applyCipherSelectionChange(state, "caesar")).toBe(state);
    });
  });

  it("exibe texto de ajuda da cifra Atbash (primeira do registry) como nota", () => {
    render(<CipherWorkspace />);
    const first = getAllCiphers()[0];
    expect(first?.id).toBe("atbash");
    expect(screen.getByRole("note", { name: "Parâmetros" })).toBeInTheDocument();
  });

  it("exige deslocamento na César antes de habilitar Codificar com texto", () => {
    render(<CipherWorkspace />);

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "caesar" } });
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "abc" },
    });

    expect(screen.getByRole("button", { name: "Codificar" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Deslocamento/), { target: { value: "1" } });
    expect(screen.getByRole("button", { name: "Codificar" })).not.toBeDisabled();
  });

  it("após trocar de César para Vigenère, parâmetros são limpos e palavra-chave volta a ser obrigatória", () => {
    render(<CipherWorkspace />);

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "caesar" } });
    fireEvent.change(screen.getByLabelText(/Deslocamento/), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "abc" },
    });
    expect(screen.getByRole("button", { name: "Codificar" })).not.toBeDisabled();

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "vigenere" } });
    expect(screen.queryByLabelText(/Deslocamento/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Palavra-chave/)).toHaveValue("");
    expect(screen.getByRole("button", { name: "Codificar" })).toBeDisabled();
  });
});
