import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiUrl } from "../api";

describe("apiUrl", () => {
  type MutableEnv = { DEV?: boolean; VITE_API_BASE?: string | undefined };
  const originalEnv = { ...import.meta.env } as Record<string, unknown>;
  beforeEach(() => {
    Object.assign(
      import.meta.env as unknown as Record<string, unknown>,
      originalEnv
    );
  });

  it("usa /api en DEV", () => {
    (import.meta.env as unknown as MutableEnv).DEV = true;
    expect(apiUrl("/facturas")).toBe("/api/facturas");
    expect(apiUrl("pagos")).toBe("/api/pagos");
  });

  it("usa VITE_API_BASE en prod", () => {
    (import.meta.env as unknown as MutableEnv).DEV = false;
    (import.meta.env as unknown as MutableEnv).VITE_API_BASE =
      "https://x.y/api";
    expect(apiUrl("/facturas")).toBe("https://x.y/api/facturas");
  });

  it("advierte y devuelve path si falta VITE_API_BASE", () => {
    (import.meta.env as unknown as MutableEnv).DEV = false;
    (import.meta.env as unknown as MutableEnv).VITE_API_BASE = undefined;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(apiUrl("/hola")).toBe("/hola");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
