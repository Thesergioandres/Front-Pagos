import type { CarteraFactura } from "../../types";

type Props = {
  data: CarteraFactura[];
  loading: boolean;
  onReload: () => void;
};

export default function CarteraTableUI({ data, loading, onReload }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        className="mb-4 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        onClick={onReload}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Ver Cartera"}
      </button>
      {Array.isArray(data) && data.length > 0 && (
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
              {data.map((f) => (
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
