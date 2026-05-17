/**
 * Checklist manual CV-014 (colar na descrição da PR):
 * - Entrada vazia ou só espaços: botões desativados, sem erro de transformação.
 * - César sem deslocamento com texto: botões desativados.
 * - César com deslocamento não inteiro ou inválido: mensagem de erro no campo (PT).
 * - Vigenère com chave vazia ou com dígitos/símbolos: mensagem no campo (PT).
 * - Morse: decodificar "..-.-" mostra alerta com trecho problemático em PT.
 * - Após erro de transformação, trocar de cifra ou editar entrada/params: alerta some.
 * - Happy path: Atbash com "abc", César com shift 1, Morse roundtrip "SOS".
 *
 * Checklist manual CV-016 — viewports / contraste / a11y (colar na descrição da PR):
 * - 320×568 e 375×667: sem scroll horizontal; padding legível; botões full-width empilhados.
 * - 768×1024: grid entrada/resultado em duas colunas; formulário e textareas usam largura sem overflow.
 * - 1024×768+: max-width do conteúdo coerente; foco visível ao Tab em select, inputs, textareas e botões.
 * - Tema claro e escuro: subtítulo do header e textos de ajuda legíveis; alerta de erro de transformação legível.
 * - Tab order: Cifra → parâmetros → entrada → resultado → Codificar → Decodificar (sem tabIndex positivo).
 * - Erro Morse "..-.-" anunciado (assertive no workspace); erros de campo com aria-live polite onde aplicável.
 * - `html lang="pt-BR"` e rótulos em PT conferidos no inspetor / leitor de tela.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { getAllCiphers, getCiphersForSelector } from "@/lib/ciphers";
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

  it("Codificar aplica a cifra Atbash (primeira do registry)", () => {
    render(<CipherWorkspace />);
    expect(getAllCiphers()[0]?.id).toBe("atbash");
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "abc def" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Codificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("zyx wvu");
  });

  it("Decodificar aplica Atbash (mesma operação que codificar)", () => {
    render(<CipherWorkspace />);
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "ABC DEF" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Decodificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("ZYX WVU");
  });

  it("limpa o resultado quando a entrada fica vazia ou só com espaços após trim", () => {
    render(<CipherWorkspace />);
    const input = screen.getByLabelText("Texto de entrada");
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: "Codificar" }));
    expect(screen.getByLabelText("Resultado")).toHaveValue("sr");

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByLabelText("Resultado")).toHaveValue("");

    fireEvent.change(input, { target: { value: "   \t" } });
    expect(screen.getByLabelText("Resultado")).toHaveValue("");
  });

  it("lista no seletor só cifras visíveis (sem Identity; Identity permanece no registry)", () => {
    render(<CipherWorkspace />);

    expect(getAllCiphers().some((c) => c.id === "identity")).toBe(true);
    expect(getCiphersForSelector().some((c) => c.id === "identity")).toBe(false);

    const expectedNames = getCiphersForSelector().map((cipher) => cipher.name);
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(expectedNames.length);
    expect(options.map((option) => option.textContent)).toEqual(expectedNames);
    expect(screen.queryByRole("option", { name: "Identity" })).not.toBeInTheDocument();
  });

  it("exibe erro em português ao decodificar Morse inválido", () => {
    render(<CipherWorkspace />);

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "morse" } });
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "..-.-" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Decodificar" }));

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toMatch(/interpretada/i);
    expect(alert.textContent).toContain("..-.-");
    expect(screen.getByLabelText("Resultado")).toHaveValue("");
  });

  it("remove o alerta de transformação ao trocar de cifra", () => {
    render(<CipherWorkspace />);

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "morse" } });
    fireEvent.change(screen.getByLabelText("Texto de entrada"), {
      target: { value: "..-.-" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Decodificar" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Cifra"), { target: { value: "atbash" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
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
