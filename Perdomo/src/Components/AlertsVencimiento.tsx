import { useApi } from "../hooks/useApi";

type AlertaVencimiento = {
  factura: string;
  cliente: string;
  fechaVencimiento: string;
  diasMora: number;
  saldoPendiente: number;
};

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AlertsVencimiento() {
  const { data, loading } = useApi<AlertaVencimiento[]>(async () => {
    const res = await fetch(`${API_BASE}/facturas/alertas-vencimiento`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("No se pudo obtener las alertas");
    const result = await res.json();
    return Array.isArray(result) ? result : [result];
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
