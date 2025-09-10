import { describe, it, expect } from "vitest";
import { parseView, DEFAULT_VIEW, parsePaymentsFilter } from "../constants";

describe("constants extra", () => {
  it("parseView acepta todos los valores permitidos", () => {
    const allowed = [
      "pagos",
      "nuevoPago",
      "cartera",
      "facturasVencidas",
      "reporteVendedor",
      "dashboard",
    ] as const;
    for (const v of allowed) expect(parseView(v)).toBe(v);
  });
  it("parseView cae en DEFAULT_VIEW para cualquier otro", () => {
    expect(parseView(null as any)).toBe(DEFAULT_VIEW);
    expect(parseView(123 as any)).toBe(DEFAULT_VIEW);
    expect(parseView({} as any)).toBe(DEFAULT_VIEW);
  });
  it("parsePaymentsFilter ignora objetos sin shape", () => {
    expect(parsePaymentsFilter({})).toBeNull();
    expect(parsePaymentsFilter({ field: "factura" } as any)).toBeNull();
    expect(parsePaymentsFilter({ value: "x" } as any)).toBeNull();
  });
});
