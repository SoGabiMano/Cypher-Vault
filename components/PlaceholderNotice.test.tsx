import { render, screen } from "@testing-library/react";
import { PlaceholderNotice } from "./PlaceholderNotice";

describe("PlaceholderNotice", () => {
  it("renderiza o título", () => {
    render(<PlaceholderNotice title="Em breve" />);
    expect(screen.getByText("Em breve")).toBeInTheDocument();
  });

  it("mostra metadados quando sampleCipher é passado", () => {
    render(
      <PlaceholderNotice
        title="Cifra"
        sampleCipher={{ id: "demo", label: "Demonstração" }}
      />,
    );
    expect(screen.getByText(/Demonstração/)).toBeInTheDocument();
    expect(screen.getByText(/demo/)).toBeInTheDocument();
  });
});
