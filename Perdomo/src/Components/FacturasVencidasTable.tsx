import { useState } from "react";
import { authFetch } from "../utils/authFecht";

type FacturaVencida = {
  factura: string;
  cliente: string;
  fechaVencimiento: string;
  diasMora: number;
  saldoPendiente: number;
};

const API_BASE =
  "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api";

export default function FacturasVencidasTable() {
  const [facturas, setFacturas] = useState<FacturaVencida[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/facturas/alertas-vencimiento`);
      if (!res.ok) throw new Error("No se pudo obtener las facturas vencidas");
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : [data]);
    } catch {
      alert("Error al cargar las facturas vencidas");
      setFacturas([]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        className="mb-4 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
        onClick={handleLoad}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Cargar Facturas Vencidas"}
      </button>
      {facturas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Fecha Vencimiento</th>
                <th>Días Mora</th>
                <th>Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.factura}>
                  <td>{f.factura}</td>
                  <td>{f.cliente}</td>
                  <td>{f.fechaVencimiento}</td>
                  <td className="font-bold text-red-600">{f.diasMora}</td>
                  <td>{f.saldoPendiente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
