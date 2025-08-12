import type { Payment } from "../types";

type Props = {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (facturaId: string) => void;
  onHistory: (facturaId: string) => void; // Nueva prop
};

export default function PaymentTable({
  payments,
  onEdit,
  onDelete,
  onHistory,
}: Props) {
  return (
    <div>
      <div
        className="w-3/4 max-w-full overflow-x-auto rounded-xl shadow-lg border border-blue-800 bg-white mx-auto"
        style={{ maxHeight: "calc(90vh - 150px)", overflowY: "auto" }}
      >
        <table className="min-w-[1200px]">
          <thead>
            <tr className="bg-blue-800 text-white font-semibold">
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Factura
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Código
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Cliente
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Tipo Factura
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Valor Factura
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Población
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Condición Pago
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Fecha Factura
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">Saldo</th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Vendedor
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Observación
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Estado
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Descuento
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Apoyo Aniversario
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Retención Fuente
              </th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">ICA</th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">Abono</th>
              <th className="px-3 py-2 sticky top-0 bg-blue-800 z-10">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className="even:bg-blue-50">
                <td className="px-3 py-2 text-blue-800">{p.factura}</td>
                <td className="px-3 py-2 text-blue-800">{p.codigo}</td>
                <td className="px-3 py-2 text-blue-800">{p.cliente}</td>
                <td className="px-3 py-2 text-blue-800">{p.tipoFactura}</td>
                <td className="px-3 py-2 text-blue-800">{p.valorFactura}</td>
                <td className="px-3 py-2 text-blue-800">{p.poblacion}</td>
                <td className="px-3 py-2 text-blue-800">{p.condicionPago}</td>
                <td className="px-3 py-2 text-blue-800">{p.fechaFactura}</td>
                <td className="px-3 py-2 text-blue-800">{p.saldo}</td>
                <td className="px-3 py-2 text-blue-800">{p.vendedor}</td>
                <td className="px-3 py-2 text-blue-800">{p.observacion}</td>
                <td className="px-3 py-2 text-blue-800">{p.estado}</td>
                <td className="px-3 py-2 text-blue-800">{p.descuento}</td>
                <td className="px-3 py-2 text-blue-800">
                  {p.apoyoAniversario}
                </td>
                <td className="px-3 py-2 text-blue-800">{p.retencionFuente}</td>
                <td className="px-3 py-2 text-blue-800">{p.ica}</td>
                <td className="px-3 py-2 text-blue-800">{p.abono}</td>
                <td className="px-3 py-2 text-blue-800">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p.factura)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => onHistory(p.factura)}
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    Ver historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
