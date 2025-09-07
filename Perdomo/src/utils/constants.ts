export const LAST_VIEW_KEY = "last_view" as const;

export type View =
  | "pagos"
  | "nuevoPago"
  | "cartera"
  | "facturasVencidas"
  | "reporteVendedor"
  | "dashboard";

export const DEFAULT_VIEW: View = "pagos";

export function parseView(v: unknown): View {
  switch (v) {
    case "pagos":
    case "nuevoPago":
    case "cartera":
    case "facturasVencidas":
    case "reporteVendedor":
    case "dashboard":
      return v;
    default:
      return DEFAULT_VIEW;
  }
}

export const LAST_PAYMENTS_FILTER_KEY = "last_payments_filter" as const;
export type PaymentsFilter = { field: "factura" | "cliente"; value: string };
function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
export function parsePaymentsFilter(v: unknown): PaymentsFilter | null {
  try {
    if (!v) return null;
    const raw: unknown = typeof v === "string" ? JSON.parse(v) : v;
    if (isObjectRecord(raw)) {
      const f = raw["field"];
      const val = raw["value"];
      if ((f === "factura" || f === "cliente") && typeof val === "string") {
        return { field: f, value: val };
      }
    }
  } catch {
    // noop
  }
  return null;
}
