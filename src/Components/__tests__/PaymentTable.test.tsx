import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentTable from "../PaymentTable";
import type { Payment } from "../../types";

vi.mock("../../context/use-auth", () => ({
  useAuth: () => ({ userRole: "GERENTE" }),
}));

const payments: Payment[] = [
  {
    factura: "F1",
    codigo: "C1",
    cliente: "Cliente A",
    tipoFactura: "A",
    valorFactura: 1000,
    poblacion: "X",
    condicionPago: "30",
    fechaFactura: "2025-01-01",
    saldo: 1000,
    vendedor: "V",
    observacion: "",
    estado: "PENDIENTE",
    descuento: 0,
    apoyoAniversario: 0,
    retencionFuente: 0,
    ica: 0,
    abono: 0,
    registradoPor: "user",
  },
];

describe("PaymentTable", () => {
  it("muestra acciones de gerente y dispara handlers", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onHistory = vi.fn();
    render(
      <PaymentTable
        payments={payments}
        onEdit={onEdit}
        onDelete={onDelete}
        onHistory={onHistory}
      />
    );
    fireEvent.click(screen.getByText(/Editar/i));
    fireEvent.click(screen.getByText(/Eliminar/i));
    fireEvent.click(screen.getByText(/Ver historial/i));
    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
    expect(onHistory).toHaveBeenCalled();
  });
});
