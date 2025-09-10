/**
 * Construye la URL de la API.
 * - En desarrollo usa el proxy de Vite en /api para evitar CORS sin importar el puerto.
 * - En producción utiliza VITE_API_BASE.
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (import.meta.env.DEV) {
    return `/api${p}`;
  }
  const raw = import.meta.env.VITE_API_BASE as string | undefined;
  const base = raw && typeof raw === "string" ? raw.trim() : "";
  if (!base || base === "undefined" || base === "null") {
    console.warn(
      "[apiUrl] VITE_API_BASE no definido en producción; usando path relativo"
    );
    return p;
  }
  const cleaned = base.replace(/\/+$/, "");
  return `${cleaned}${p}`;
}
