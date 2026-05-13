import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import type { CipherParamField } from "@/types/cipher";
import { CipherParamsForm } from "./CipherParamsForm";

function NumberFormHarness() {
  const [value, setValue] = useState<Record<string, unknown>>({});
  const paramFields: readonly CipherParamField[] = [
    {
      kind: "number",
      key: "shift",
      label: "Deslocamento",
      required: true,
      integer: true,
    },
  ];
  return (
    <CipherParamsForm
      paramFields={paramFields}
      value={value}
      onParamChange={(key, v) => {
        setValue((prev) => {
          const next = { ...prev };
          if (v === undefined || v === "") {
            delete next[key];
          } else {
            next[key] = v;
          }
          return next;
        });
      }}
    />
  );
}

describe("CipherParamsForm", () => {
  it("renderiza bloco help com role note e aria-label", () => {
    const paramFields: readonly CipherParamField[] = [
      {
        kind: "help",
        key: "h1",
        label: "Ajuda",
        description: "Texto de apoio.",
      },
    ];
    render(
      <CipherParamsForm paramFields={paramFields} value={{}} onParamChange={() => {}} />,
    );
    expect(screen.getByRole("note", { name: "Ajuda" })).toHaveTextContent("Texto de apoio.");
  });

  it("renderiza campo numérico e notifica mudanças", () => {
    render(<NumberFormHarness />);
    const input = screen.getByLabelText(/Deslocamento/);
    fireEvent.change(input, { target: { value: "5" } });
    expect(input).toHaveValue(5);
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue(null);
  });

  it("renderiza campo texto e notifica mudanças", () => {
    const paramFields: readonly CipherParamField[] = [
      {
        kind: "string",
        key: "key",
        label: "Palavra-chave",
        required: true,
      },
    ];
    const onParamChange = jest.fn();
    render(
      <CipherParamsForm paramFields={paramFields} value={{}} onParamChange={onParamChange} />,
    );
    fireEvent.change(screen.getByLabelText(/Palavra-chave/), {
      target: { value: "abc" },
    });
    expect(onParamChange).toHaveBeenCalledWith("key", "abc");
  });

  it("exibe erro por campo e erro global", () => {
    const paramFields: readonly CipherParamField[] = [
      {
        kind: "string",
        key: "key",
        label: "Chave",
        required: true,
      },
    ];
    render(
      <CipherParamsForm
        paramFields={paramFields}
        value={{}}
        onParamChange={() => {}}
        errors={{ key: "Chave inválida", "*": "Erro geral" }}
      />,
    );
    expect(screen.getByText("Chave inválida")).toBeInTheDocument();
    expect(screen.getByText("Erro geral")).toBeInTheDocument();
  });

  it("lista vazia não renderiza campos", () => {
    const { container } = render(
      <CipherParamsForm paramFields={[]} value={{}} onParamChange={() => {}} />,
    );
    expect(container.querySelector("input")).toBeNull();
    expect(container.querySelector('[role="note"]')).toBeNull();
  });
});
