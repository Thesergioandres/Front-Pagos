/* Logger sencillo y seguro para depurar API */

function isDebug() {
  const env = import.meta.env as { DEV?: boolean; VITE_DEBUG_API?: string };
  return !!env.DEV || env.VITE_DEBUG_API === "1";
}

function mask(value?: string) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

function shortId() {
  return Math.random().toString(36).slice(2, 6);
}

export type ApiLogContext = {
  id: string;
  url: string;
  method: string;
};

type ApiLogEntry = { t: number; dir: "→" | "←" | "!"; text: string };
const __API_LOGS__: ApiLogEntry[] = [];

function pushLog(dir: ApiLogEntry["dir"], text: string) {
  if (!isDebug()) return;
  __API_LOGS__.push({ t: Date.now(), dir, text });
  if (__API_LOGS__.length > 200) __API_LOGS__.shift();
  // Exponer para el overlay de depuración
  try {
    (globalThis as unknown as { __API_LOGS__?: ApiLogEntry[] }).__API_LOGS__ =
      __API_LOGS__;
  } catch {
    // ignore
  }
}

export function beginApiLog(
  url: string,
  method: string,
  headers: Record<string, unknown>,
  body?: unknown
): ApiLogContext {
  const id = shortId();
  if (isDebug()) {
    const safeHeaders = { ...headers } as Record<string, string>;
    if (safeHeaders["Authorization"]) {
      safeHeaders["Authorization"] = `Bearer ${mask(
        String(safeHeaders["Authorization"]).replace(/^Bearer\s+/i, "")
      )}`;
    }
    const bodyKind =
      body instanceof FormData ? "FormData" : body ? typeof body : "none";
    // No imprimir contenido del body para evitar exponer datos; solo tipo y claves en FormData
    let formKeys: string[] | undefined;
    if (body instanceof FormData) {
      formKeys = Array.from(body.keys());
    }
    console.info(`[api:${id}] → ${method.toUpperCase()} ${url}`, {
      headers: safeHeaders,
      body: bodyKind,
      formKeys,
    });
    pushLog("→", `${method.toUpperCase()} ${url}`);
  }
  return { id, url, method };
}

export async function logApiResponse(
  ctx: ApiLogContext,
  res: Response,
  startedAt: number
) {
  const elapsed = Date.now() - startedAt;
  if (!isDebug() && res.ok) return; // solo log detallado en errores a menos que esté en debug
  try {
    const clone = res.clone();
    const contentType = clone.headers.get("content-type") || "";
    let preview = "";
    if (!res.ok) {
      if (contentType.includes("application/json")) {
        const text = await clone.text();
        preview = text.slice(0, 2000);
      } else {
        const text = await clone.text();
        preview = text.slice(0, 2000);
      }
    }
    console.info(
      `[api:${ctx.id}] ← ${res.status} ${
        res.ok ? "OK" : "ERROR"
      } (${elapsed}ms) ${ctx.method.toUpperCase()} ${ctx.url}`,
      {
        contentType,
        preview: preview || (res.ok ? "<ok>" : "<no-body>"),
      }
    );
    pushLog(
      "←",
      `${res.status} ${
        res.ok ? "OK" : "ERROR"
      } (${elapsed}ms) ${ctx.method.toUpperCase()} ${ctx.url}`
    );
  } catch {
    console.warn(
      `[api:${ctx.id}] No se pudo leer el cuerpo de la respuesta para logging (${elapsed}ms)`
    );
  }
}

function hasName(e: unknown): e is { name?: string } {
  return typeof e === "object" && e !== null && "name" in e;
}

function isAbortLike(err: unknown): boolean {
  // DOM AbortError
  if (
    (err instanceof DOMException && err.name === "AbortError") ||
    (hasName(err) && err.name === "AbortError")
  )
    return true;
  // Razones string usadas en abort(reason)
  if (typeof err === "string") {
    return ["timeout", "external-abort", "unmount", "replaced"].includes(err);
  }
  // Mensajes comunes de abort en distintos runtimes
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    const m = (err as { message: string }).message;
    if (m.toLowerCase().includes("abort")) return true;
  }
  return false;
}

export function logApiError(ctx: ApiLogContext, err: unknown) {
  const isAbort = isAbortLike(err);
  const level = isAbort ? console.warn : console.error;
  level(
    `[api:${ctx.id}] ${
      isAbort ? "⚠" : "✖"
    } Error en ${ctx.method.toUpperCase()} ${ctx.url}:`,
    err
  );
  pushLog(
    "!",
    `${isAbort ? "Abort" : "Error"} ${ctx.method.toUpperCase()} ${
      ctx.url
    }: ${String((err as { message?: unknown }).message ?? err)}`
  );
}
