import { describe, it, expect } from "vitest";
import { parseView, DEFAULT_VIEW, parsePaymentsFilter } from "../constants";

describe("constants", () => {
  it("parseView retorna DEFAULT_VIEW para desconocidos", () => {
    expect(parseView("x")).toBe(DEFAULT_VIEW);
    expect(parseView(undefined)).toBe(DEFAULT_VIEW);
  });
  it("parsePaymentsFilter parsea valores válidos", () => {
    expect(parsePaymentsFilter({ field: "factura", value: "123" })).toEqual({
      field: "factura",
      value: "123",
    });
    expect(parsePaymentsFilter('{"field":"cliente","value":"acme"}')).toEqual({
      field: "cliente",
      value: "acme",
    });
  });
  it("parsePaymentsFilter devuelve null para inválidos", () => {
    expect(parsePaymentsFilter("{]")).toBeNull();
    expect(
      parsePaymentsFilter({ field: "otro", value: "x" } as any)
    ).toBeNull();
    expect(
      parsePaymentsFilter({ field: "cliente", value: 3 } as any)
    ).toBeNull();
  });
});
