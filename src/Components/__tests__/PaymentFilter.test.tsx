import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentFilter from "../PaymentFilter";

vi.mock("../../context/use-toast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("../../utils/authFecht", () => ({
  authFetch: vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    ),
}));

vi.mock("../../utils/api", () => ({
  apiUrl: (p: string) => p,
}));

describe("PaymentFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza y permite escribir y buscar", async () => {
    const onFilterResult = vi.fn();
    render(<PaymentFilter onFilterResult={onFilterResult} />);

    const input = screen.getByPlaceholderText(/Buscar por/i);
    fireEvent.change(input, { target: { value: "123" } });
    const btn = screen.getByRole("button", { name: /Buscar/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(onFilterResult).toHaveBeenCalled();
    });
  });
});
