import type { CarteraFactura } from "../types";
import React from "react";

interface CarteraTableUIProps {
  data: CarteraFactura[];
  loading: boolean;
  onReload: () => void;
  onExport?: () => void;
}

const CarteraTableUI: React.FC<CarteraTableUIProps> = ({
  data,
  loading,
  onReload,
  onExport,
}) => {
  console.log("[CarteraTableUI] Datos recibidos:", data);
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h2 className="text-2xl font-bold text-blue-800">Cartera</h2>
        <div className="flex gap-2">
          <button
            onClick={onReload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Recargar
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              Exportar Excel
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-blue-700 font-semibold">
          Cargando cartera...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay facturas en cartera.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-blue-800 bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="px-3 py-2">Factura</th>
                <th className="px-3 py-2">Cliente</th>
                <th className="px-3 py-2">Valor</th>
                <th className="px-3 py-2">Fecha Vencimiento</th>
                <th className="px-3 py-2">Días Mora</th>
                <th className="px-3 py-2">Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {data.map((factura) => (
                <tr key={factura.facturaId} className="even:bg-blue-50">
                  <td className="px-3 py-2 text-blue-800">
                    {factura.facturaId}
                  </td>
                  <td className="px-3 py-2 text-blue-800">{factura.cliente}</td>
                  <td className="px-3 py-2 text-blue-800">
                    ${factura.valor.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-blue-800">
                    {factura.fechaVencimiento}
                  </td>
                  <td className="px-3 py-2 text-blue-800">
                    {factura.diasMora}
                  </td>
                  <td className="px-3 py-2 text-blue-800">
                    ${factura.valor.toLocaleString()}
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

export default React.memo(CarteraTableUI);
