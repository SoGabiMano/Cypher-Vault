import { placeholderEcho } from "./placeholder";

describe("placeholder (lib)", () => {
  it("ecoa o valor", () => {
    expect(placeholderEcho("ping")).toBe("ping");
  });
});
