import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authFetch, UnauthorizedError } from "../authFecht";

const REAL_FETCH = globalThis.fetch;

function setToken(kind: "access" | "id" | "legacy" | "none") {
  localStorage.clear();
  if (kind === "access") localStorage.setItem("cognito_access_token", "aaa");
  if (kind === "id") localStorage.setItem("cognito_id_token", "iii");
  if (kind === "legacy") localStorage.setItem("cognito_token", "lll");
}

describe("authFecht", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // minimal logger mocks to avoid dynamic import side-effects noise
    vi.mock("../logger", () => ({
      beginApiLog: () => ({ id: "t", url: "u", method: "GET" }),
      logApiResponse: vi.fn(),
      logApiError: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
    globalThis.fetch = REAL_FETCH as any;
    localStorage.clear();
  });

  it("inyecta Authorization con access token por defecto y respeta status ok", async () => {
    setToken("access");
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response("ok", { status: 200 }));
    globalThis.fetch = fetchSpy as any;
    const res = await authFetch("/x");
    expect(res.status).toBe(200);
    const init = fetchSpy.mock.calls[0][1];
    expect(init.headers.Authorization).toMatch(/^Bearer /);
  });

  it("si 401 con access, reintenta con id y persiste tipo si ok", async () => {
    setToken("access");
    localStorage.setItem("cognito_id_token", "ii");
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response("no", { status: 401 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    globalThis.fetch = fetchSpy as any;
    const res = await authFetch("/y");
    expect(res.status).toBe(200);
    expect(localStorage.getItem("AUTH_TOKEN_TYPE")).toBe("id");
    // 2 intentos
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("si 401 con access e id, usa legacy si hay y devuelve ok", async () => {
    setToken("access");
    localStorage.setItem("cognito_id_token", "ii");
    localStorage.setItem("cognito_token", "ll");
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response("no", { status: 401 }))
      .mockResolvedValueOnce(new Response("no2", { status: 401 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    globalThis.fetch = fetchSpy as any;
    const res = await authFetch("/z");
    expect(res.status).toBe(200);
    expect(localStorage.getItem("AUTH_TOKEN_TYPE")).toBe("legacy");
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it("si todos 401 lanza UnauthorizedError", async () => {
    setToken("access");
    localStorage.setItem("cognito_id_token", "ii");
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response("no", { status: 401 }))
      .mockResolvedValueOnce(new Response("no2", { status: 401 }));
    globalThis.fetch = fetchSpy as any;
    await expect(authFetch("/w")).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("maneja abort controlado externamente", async () => {
    // usar timers reales para this case
    vi.useRealTimers();
    setToken("access");
    const controller = new AbortController();
    const fetchSpy = vi
      .fn()
      .mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          const sig = init?.signal as AbortSignal | undefined;
          const rejectAbort = () => {
            const e = new Error("Aborted");
            (e as any).name = "AbortError";
            reject(e);
          };
          if (sig?.aborted) return rejectAbort();
          sig?.addEventListener("abort", rejectAbort, { once: true });
        });
      });
    globalThis.fetch = fetchSpy as any;

    // Abortar después de 10ms
    setTimeout(() => controller.abort("test"), 10);

    const p = authFetch("/slow", { signal: controller.signal });
    await expect(p).rejects.toBeTruthy();
  }, 2000);
});
