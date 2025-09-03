import type { FacturaVencida } from "../types";
import React from "react";

interface FacturasVencidasTableUIProps {
  data: FacturaVencida[];
  loading: boolean;
  onReload: () => void;
}

const FacturasVencidasTableUI: React.FC<FacturasVencidasTableUIProps> = ({
  data,
  loading,
  onReload,
}) => {
  console.log("[FacturasVencidasTableUI] Datos recibidos:", data);
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-red-700">Facturas Vencidas</h2>
        <button
          onClick={onReload}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          Recargar
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-red-700 font-semibold">
          Cargando facturas vencidas...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay facturas vencidas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-red-700 bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-red-700 text-white">
                <th className="px-3 py-2">Factura</th>
                <th className="px-3 py-2">Cliente</th>
                <th className="px-3 py-2">Fecha Vencimiento</th>
                <th className="px-3 py-2">Días Mora</th>
                <th className="px-3 py-2">Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {data.map((factura) => (
                <tr key={factura.factura} className="even:bg-red-50">
                  <td className="px-3 py-2 text-red-800">{factura.factura}</td>
                  <td className="px-3 py-2 text-red-800">{factura.cliente}</td>
                  <td className="px-3 py-2 text-red-800">
                    {factura.fechaVencimiento}
                  </td>
                  <td className="px-3 py-2 text-red-800">{factura.diasMora}</td>
                  <td className="px-3 py-2 text-red-800">
                    ${factura.saldoPendiente.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(FacturasVencidasTableUI);
