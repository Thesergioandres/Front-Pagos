export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

type TokenType = "access" | "id" | "legacy";

function pickToken(preference?: TokenType): {
  token?: string;
  type?: TokenType;
} {
  const access = localStorage.getItem("cognito_access_token") || undefined;
  const id = localStorage.getItem("cognito_id_token") || undefined;
  const legacy = localStorage.getItem("cognito_token") || undefined; // id token legacy
  const stored = localStorage.getItem("AUTH_TOKEN_TYPE") as TokenType | null;
  const pref: TokenType =
    preference ||
    (stored === "id" || stored === "access" || stored === "legacy"
      ? stored
      : "access");
  const order: TokenType[] =
    pref === "id"
      ? ["id", "access", "legacy"]
      : pref === "legacy"
      ? ["legacy", "access", "id"]
      : ["access", "id", "legacy"];
  for (const t of order) {
    if (t === "access" && access) return { token: access, type: "access" };
    if (t === "id" && id) return { token: id, type: "id" };
    if (t === "legacy" && legacy) return { token: legacy, type: "legacy" };
  }
  return {};
}

function toHeaderObject(h?: HeadersInit): Record<string, string> {
  const out: Record<string, string> = {};
  if (!h) return out;
  if (h instanceof Headers) {
    for (const [k, v] of h.entries()) out[k] = String(v);
    return out;
  }
  if (Array.isArray(h)) {
    for (const [k, v] of h) out[String(k)] = String(v);
    return out;
  }
  for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
    out[String(k)] = String(v as unknown as string);
  }
  return out;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const { beginApiLog, logApiResponse, logApiError } = await import("./logger");
  const method = ((init.method || "GET") as string).toUpperCase();
  const startedAt = Date.now();
  const externalSignal = init.signal as AbortSignal | undefined;
  const controller = new AbortController();
  const onAbort = () =>
    controller.abort(externalSignal?.reason ?? "external-abort");
  if (externalSignal) {
    if (externalSignal.aborted)
      controller.abort(externalSignal.reason ?? "external-abort");
    else externalSignal.addEventListener("abort", onAbort, { once: true });
  }

  const attemptOnce = async (tokenType?: TokenType) => {
    const picked = pickToken(tokenType);
    const baseHeaders = toHeaderObject(init.headers);
    const headers: HeadersInit = {
      ...baseHeaders,
      ...(picked.token ? { Authorization: `Bearer ${picked.token}` } : {}),
    };
    const label = `${String(input)}${picked.type ? ` [t:${picked.type}]` : ""}`;
    const ctx = beginApiLog(
      label,
      method,
      headers as Record<string, unknown>,
      init.body
    );
    let response: Response;
    try {
      response = await fetch(input, {
        ...init,
        headers,
        signal: controller.signal,
      });
    } catch (err) {
      logApiError(ctx, err);
      throw err;
    }
    await logApiResponse(ctx, response, startedAt);
    return { response, used: picked.type } as const;
  };

  try {
    // Primer intento según preferencia (persistida) -> por defecto access
    const first = await attemptOnce();
    if (first.response.status !== 401) {
      if (first.used) localStorage.setItem("AUTH_TOKEN_TYPE", first.used);
      return first.response;
    }
    // Si 401, intenta con el alternativo principal (access<->id)
    const alt: TokenType | undefined =
      first.used === "access"
        ? "id"
        : first.used === "id"
        ? "access"
        : undefined;
    if (alt) {
      const second = await attemptOnce(alt);
      if (second.response.status !== 401) {
        if (second.used) localStorage.setItem("AUTH_TOKEN_TYPE", second.used);
        return second.response;
      }
      // Intento adicional con token 'legacy' si existe
      const hasLegacy = !!localStorage.getItem("cognito_token");
      if (hasLegacy) {
        const third = await attemptOnce("legacy");
        if (third.response.status !== 401) {
          if (third.used) localStorage.setItem("AUTH_TOKEN_TYPE", third.used);
          return third.response;
        }
      }
    }
    // Ambos intentos devolvieron 401 → no autorizado
    throw new UnauthorizedError();
  } finally {
    if (externalSignal) externalSignal.removeEventListener("abort", onAbort);
  }
}
