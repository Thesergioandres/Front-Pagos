import type { Factura } from "../../types";
import Button from "./Button";
import Input from "./Input";

type Props = {
  data: Factura[];
  loading: boolean;
  onReload: () => void;
  nombre: string;
  setNombre: (v: string) => void;
};

export default function SellerInvoicesUI({
  data,
  loading,
  onReload,
  nombre,
  setNombre,
}: Props) {
  console.log("[SellerInvoicesUI] Datos recibidos:", data);
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Nombre del vendedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Button
          onClick={onReload}
          disabled={loading || !nombre}
          isLoading={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
      {Array.isArray(data) && data.length > 0 && (
        <div
          className="w-full max-w-full overflow-x-auto rounded-xl shadow-lg border border-brand-700 bg-white"
          style={{ maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}
        >
          <table className="min-w-[1000px] text-xs">
            <thead>
              <tr className="bg-brand-800 text-white font-semibold">
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Factura
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Código
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Tipo
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Valor
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Población
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Cond. Pago
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Fecha
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Saldo
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Vendedor
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Observación
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Estado
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Descuento
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Apoyo Aniv.
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Ret. Fuente
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  ICA
                </th>
                <th className="px-3 py-2 sticky top-0 bg-brand-800 z-10">
                  Abono
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.factura} className="even:bg-brand-50">
                  <td className="px-3 py-2 text-brand-800">{f.factura}</td>
                  <td className="px-3 py-2 text-brand-800">{f.codigo}</td>
                  <td className="px-3 py-2 text-brand-800">{f.tipoFactura}</td>
                  <td className="px-3 py-2 text-brand-800">{f.valorFactura}</td>
                  <td className="px-3 py-2 text-brand-800">{f.poblacion}</td>
                  <td className="px-3 py-2 text-brand-800">
                    {f.condicionPago}
                  </td>
                  <td className="px-3 py-2 text-brand-800">{f.fechaFactura}</td>
                  <td className="px-3 py-2 text-brand-800">{f.saldo}</td>
                  <td className="px-3 py-2 text-brand-800">{f.vendedor}</td>
                  <td className="px-3 py-2 text-brand-800">{f.observacion}</td>
                  <td className="px-3 py-2 text-brand-800">{f.estado}</td>
                  <td className="px-3 py-2 text-brand-800">{f.descuento}</td>
                  <td className="px-3 py-2 text-brand-800">
                    {f.apoyoAniversario}
                  </td>
                  <td className="px-3 py-2 text-brand-800">
                    {f.retencionFuente}
                  </td>
                  <td className="px-3 py-2 text-brand-800">{f.ica}</td>
                  <td className="px-3 py-2 text-brand-800">{f.abono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
