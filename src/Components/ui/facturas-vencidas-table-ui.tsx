import type { FacturaVencida } from "../../types";
import Button from "./Button";

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
    <div className="w-full max-w-5xl mx-auto">
      <Button
        className="mb-4"
        onClick={onReload}
        disabled={loading}
        isLoading={loading}
      >
        {loading ? "Cargando..." : "Ver Facturas Vencidas"}
      </Button>
      {Array.isArray(data) && data.length > 0 && (
        <div
          className="w-full max-w-full overflow-x-auto rounded-xl shadow-lg border border-brand-700 bg-white"
          style={{ maxHeight: "calc(90vh - 150px)", overflowY: "auto" }}
        >
          <table className="min-w-[800px] text-xs">
            <thead>
              <tr className="bg-brand-800 text-white font-semibold">
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Factura
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Cliente
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Fecha Vencimiento
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Días Mora
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Saldo Pendiente
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.factura} className="even:bg-brand-50">
                  <td className="px-3 py-2 text-brand-800">{f.factura}</td>
                  <td className="px-3 py-2 text-brand-800">{f.cliente}</td>
                  <td className="px-3 py-2 text-brand-800">
                    {f.fechaVencimiento}
                  </td>
                  <td className="px-3 py-2 text-brand-800">{f.diasMora}</td>
                  <td className="px-3 py-2 text-brand-800">
                    {f.saldoPendiente}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
