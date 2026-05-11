import { render, screen, fireEvent } from "@testing-library/react";
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
});
