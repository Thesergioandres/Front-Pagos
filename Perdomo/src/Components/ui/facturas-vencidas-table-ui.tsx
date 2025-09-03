import type { FacturaVencida } from "../../types";

type Props = {
  data: FacturaVencida[];
  loading: boolean;
  onReload: () => void;
};

export default function FacturasVencidasTableUI({
  data,
  loading,
  onReload,
}: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        className="mb-4 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
        onClick={onReload}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Ver Facturas Vencidas"}
      </button>
      {Array.isArray(data) && data.length > 0 && (
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
              {data.map((f) => (
                <tr key={f.factura}>
                  <td>{f.factura}</td>
                  <td>{f.cliente}</td>
                  <td>{f.fechaVencimiento}</td>
                  <td>{f.diasMora}</td>
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
