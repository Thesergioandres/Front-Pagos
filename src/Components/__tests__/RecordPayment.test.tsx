import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecordPayment from "../record-payments";

describe("RecordPayment", () => {
  it("envía el formulario y limpia campos al ok", async () => {
    const onRegister = vi.fn().mockResolvedValue(true);
    render(<RecordPayment onRegister={onRegister} usuarioActual="admin" />);

    // Primer input de texto corresponde a factura; el numérico es el valor
    const facturaInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;
    const valorInput = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(facturaInput, { target: { value: "F1" } });
    fireEvent.change(valorInput, { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar Pago/i }));

    await waitFor(() => expect(onRegister).toHaveBeenCalled());
    // campos limpian: el input de factura queda vacío
    expect(facturaInput.value).toBe("");
  });
});
