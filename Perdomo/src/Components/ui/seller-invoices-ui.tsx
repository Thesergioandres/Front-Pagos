import type { Factura } from "../../types";

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
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Nombre del vendedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onReload}
          disabled={loading || !nombre}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
      {Array.isArray(data) && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Código</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Población</th>
                <th>Cond. Pago</th>
                <th>Fecha</th>
                <th>Saldo</th>
                <th>Vendedor</th>
                <th>Observación</th>
                <th>Estado</th>
                <th>Descuento</th>
                <th>Apoyo Aniv.</th>
                <th>Ret. Fuente</th>
                <th>ICA</th>
                <th>Abono</th>
              </tr>
            </thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.factura}>
                  <td>{f.factura}</td>
                  <td>{f.codigo}</td>
                  <td>{f.tipoFactura}</td>
                  <td>{f.valorFactura}</td>
                  <td>{f.poblacion}</td>
                  <td>{f.condicionPago}</td>
                  <td>{f.fechaFactura}</td>
                  <td>{f.saldo}</td>
                  <td>{f.vendedor}</td>
                  <td>{f.observacion}</td>
                  <td>{f.estado}</td>
                  <td>{f.descuento}</td>
                  <td>{f.apoyoAniversario}</td>
                  <td>{f.retencionFuente}</td>
                  <td>{f.ica}</td>
                  <td>{f.abono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
