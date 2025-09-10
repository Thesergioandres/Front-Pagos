import type { Payment } from "../types";

function parseNumberish(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function mapPagoResponseDtoToPayment(d: unknown): Payment {
  const o = (d ?? {}) as Record<string, unknown>;
  return {
    factura: (o["factura"] as string) ?? "",
    codigo: (o["codigo"] as string) ?? "",
    cliente: (o["cliente"] as string) ?? "",
    tipoFactura: (o["tipoFactura"] as string) ?? "",
    valorFactura: parseNumberish(o["valorFAV"] ?? o["valorFactura"] ?? 0),
    poblacion: (o["poblacion"] as string) ?? "",
    condicionPago: (o["condicionPago"] as string) ?? "",
    fechaFactura: (o["fechaFactura"] as string) ?? "",
    saldo: parseNumberish(o["saldo"] ?? 0),
    vendedor: (o["vendedor"] as string) ?? "",
    observacion:
      (o["observacion"] as string) ?? (o["observación"] as string) ?? "",
    estado:
      typeof o["cancelado"] === "boolean"
        ? (o["cancelado"] as boolean)
          ? "CANCELADO"
          : "ACTIVO"
        : (o["estado"] as string) ?? "",
    descuento: parseNumberish(o["descuento"] ?? 0),
    apoyoAniversario: parseNumberish(o["apoyoAniversario"] ?? 0),
    retencionFuente: parseNumberish(o["retencionFuente"] ?? 0),
    ica: parseNumberish(o["ica"] ?? 0),
    abono: parseNumberish(o["abono"] ?? 0),
    registradoPor:
      (o["responsable"] as string) ??
      (o["registradoPor"] as string) ??
      undefined,
  };
}

export function normalizeToPayments(input: unknown): Payment[] {
  const arr = Array.isArray(input) ? input : input ? [input] : [];
  return arr.map((item) => {
    const o = item as Record<string, unknown>;
    const looksLikePagoResponse =
      Object.prototype.hasOwnProperty.call(o, "valorFAV") ||
      typeof o["descuento"] === "string" ||
      Object.prototype.hasOwnProperty.call(o, "cancelado");
    return looksLikePagoResponse
      ? mapPagoResponseDtoToPayment(o)
      : (o as unknown as Payment);
  });
}
