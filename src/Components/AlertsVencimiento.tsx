import { useApi } from "../hooks/useApi";
import { authFetch } from "../utils/authFecht";
import { apiUrl } from "../utils/api";

type AlertaVencimiento = {
  factura: string;
  cliente: string;
  fechaVencimiento: string;
  diasMora: number;
  saldoPendiente: number;
};

// const API_BASE = import.meta.env.VITE_API_BASE;

export default function AlertsVencimiento() {
  const { data, loading } = useApi<AlertaVencimiento[]>(async () => {
    // Intento principal bajo /facturas
    let res = await authFetch(apiUrl(`/facturas/alertas-vencimiento`));
    // Fallback si el back expone el controlador de alertas bajo /alertas
    if (res.status === 404) {
      const alt = await authFetch(apiUrl(`/alertas/alertas-vencimiento`));
      if (alt.ok) res = alt;
    }
    if (!res.ok) throw new Error("No se pudo obtener las alertas");
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : [raw];
    // Adaptar nombres alternativos si el backend usa snake_case u otras claves
    const normalized = arr.map((item) => {
      const o = (item ?? {}) as Record<string, unknown>;
      const get = (k: string) => o[k];
      return {
        factura: String(get("factura") ?? get("facturaId") ?? ""),
        cliente: String(get("cliente") ?? get("nombreCliente") ?? ""),
        fechaVencimiento: String(
          get("fechaVencimiento") ?? get("fecha_vencimiento") ?? ""
        ),
        diasMora: Number(get("diasMora") ?? get("dias_mora") ?? 0),
        saldoPendiente: Number(
          get("saldoPendiente") ?? get("saldo_pendiente") ?? get("saldo") ?? 0
        ),
      } as AlertaVencimiento;
    });
    return normalized;
  });

  if (loading || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="mb-6 w-full flex flex-col items-center">
      <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg shadow max-w-3xl w-full">
        <h2 className="font-bold mb-2 text-lg">⚠️ Facturas vencidas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1">Factura</th>
                <th className="px-2 py-1">Cliente</th>
                <th className="px-2 py-1">Fecha Vencimiento</th>
                <th className="px-2 py-1">Días Mora</th>
                <th className="px-2 py-1">Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.factura}>
                  <td className="px-2 py-1">{a.factura}</td>
                  <td className="px-2 py-1">{a.cliente}</td>
                  <td className="px-2 py-1">{a.fechaVencimiento}</td>
                  <td className="px-2 py-1 font-bold text-red-600">
                    {a.diasMora}
                  </td>
                  <td className="px-2 py-1">{a.saldoPendiente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
