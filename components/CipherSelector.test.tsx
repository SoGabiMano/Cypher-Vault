import { render, screen, fireEvent } from "@testing-library/react";
import { CipherSelector } from "./CipherSelector";

const sampleCiphers = [
  { id: "alpha", name: "Alpha Cipher" },
  { id: "beta", name: "Beta Cipher" },
] as const;

describe("CipherSelector", () => {
  it("associa o label ao controle de seleção", () => {
    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="alpha"
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Cifra")).toBe(screen.getByRole("combobox"));
  });

  it("exibe o name de cada cifra como opção", () => {
    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="alpha"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole("option", { name: "Alpha Cipher" })).toHaveValue(
      "alpha",
    );
    expect(screen.getByRole("option", { name: "Beta Cipher" })).toHaveValue(
      "beta",
    );
  });

  it("reflete o id selecionado no valor do controle", () => {
    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="beta"
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Cifra")).toHaveValue("beta");
  });

  it("chama onChange com o id ao trocar a opção", () => {
    const onChange = jest.fn();

    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="alpha"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Cifra"), {
      target: { value: "beta" },
    });

    expect(onChange).toHaveBeenCalledWith("beta");
  });

  it("desabilita o controle quando disabled é true", () => {
    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="alpha"
        onChange={() => {}}
        disabled
      />,
    );

    expect(screen.getByLabelText("Cifra")).toBeDisabled();
  });

  it("gera ids únicos por instância quando selectId não é informado", () => {
    render(
      <>
        <CipherSelector
          ciphers={sampleCiphers}
          value="alpha"
          onChange={() => {}}
        />
        <CipherSelector
          ciphers={sampleCiphers}
          value="beta"
          onChange={() => {}}
        />
      </>,
    );

    const [selectA, selectB] = screen.getAllByLabelText("Cifra");
    expect(selectA.id).not.toBe(selectB.id);
  });

  it("aceita selectId definido pelo pai", () => {
    render(
      <CipherSelector
        ciphers={sampleCiphers}
        value="alpha"
        onChange={() => {}}
        selectId="cipher-selector"
      />,
    );

    expect(screen.getByLabelText("Cifra")).toHaveAttribute("id", "cipher-selector");
  });
});
