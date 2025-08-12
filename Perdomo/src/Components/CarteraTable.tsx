import { useState } from "react";
import { authFetch } from "../utils/authFecht";

type CarteraFactura = {
  facturaId: string;
  cliente: string;
  valor: number;
  fechaVencimiento: string;
  diasMora: number;
  color: string;
};

const API_BASE =
  "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api";

export default function CarteraTable() {
  const [facturas, setFacturas] = useState<CarteraFactura[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLoadCartera = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/facturas/cartera`);
      if (!res.ok) throw new Error("No se pudo obtener la cartera");
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : [data]);
    } catch {
      alert("Error al cargar la cartera");
      setFacturas([]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        className="mb-4 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        onClick={handleLoadCartera}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Ver Cartera"}
      </button>
      {facturas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr>
                <th>Factura ID</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Fecha Vencimiento</th>
                <th>Días Mora</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.facturaId} style={{ background: f.color }}>
                  <td>{f.facturaId}</td>
                  <td>{f.cliente}</td>
                  <td>{f.valor}</td>
                  <td>{f.fechaVencimiento}</td>
                  <td>{f.diasMora}</td>
                  <td>{f.color}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
