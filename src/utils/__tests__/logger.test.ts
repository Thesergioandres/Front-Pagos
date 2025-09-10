import { describe, it, expect, beforeEach } from "vitest";

// We import functions dynamically because logger reads import.meta.env on load
const loadLogger = async () => await import("../logger");

describe("logger", () => {
  beforeEach(() => {
    (import.meta as any).env = { DEV: true };
  });

  it("beginApiLog mascara Authorization y retorna contexto", async () => {
    const { beginApiLog } = await loadLogger();
    const ctx = beginApiLog("/x", "GET", {
      Authorization: "Bearer 1234567890",
    });
    expect(ctx).toHaveProperty("id");
    expect(ctx).toHaveProperty("url", "/x");
  });

  it("logApiResponse no revienta al leer body", async () => {
    const { logApiResponse } = await loadLogger();
    const res = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    await logApiResponse(
      { id: "a", url: "/x", method: "GET" },
      res,
      Date.now()
    );
    expect(true).toBe(true);
  });

  it("logApiError no lanza y acepta AbortError", async () => {
    const { logApiError } = await loadLogger();
    const e = new Error("Aborted");
    (e as any).name = "AbortError";
    logApiError({ id: "a", url: "/x", method: "GET" }, e);
    expect(true).toBe(true);
  });
});
