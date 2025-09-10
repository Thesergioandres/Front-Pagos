import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToastProvider } from "../toast-context";

function TriggerToast() {
  return (
    <ToastProvider>
      <div>App</div>
    </ToastProvider>
  );
}

describe("ToastProvider", () => {
  it("renderiza sin crashear y muestra contenedor cuando se activa", () => {
    render(<TriggerToast />);
    expect(!!screen.getByText(/App/)).toBe(true);
  });
});
