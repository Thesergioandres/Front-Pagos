import type { Payment } from "../types";

type Props = {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (facturaId: string) => void;
  onHistory: (facturaId: string) => void; // Nueva prop
};

import React, { useState } from "react";
import { useAuth } from "../context/use-auth";

const PaymentTable: React.FC<Props> = React.memo(function PaymentTable({
  payments,
  onEdit,
  onDelete,
  onHistory,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Obtener rol real desde contexto
  const { userRole } = useAuth();

  const handleAuthorizeClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPayment(null);
  };

  const handleAuthorize = () => {
    // Aquí iría la lógica real de autorización (API call)
    alert("Descuento autorizado para factura " + selectedPayment?.factura);
    handleCloseModal();
  };

  return (
    <div>
      {/* Modal de autorización */}
      {modalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2 text-blue-800">
              Autorizar descuento
            </h3>
            <p className="mb-4">
              Factura: <b>{selectedPayment.factura}</b>
            </p>
            <p className="mb-4">
              Descuento solicitado: <b>${selectedPayment.descuento}</b>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleAuthorize}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Autorizar
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
                Registrado por
              </th>
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
                <td className="px-3 py-2 text-blue-800 flex items-center gap-2">
                  {p.descuento}
                  {/* Solo gerente o vendedor puede solicitar autorización */}
                  {(userRole === "GERENTE" || userRole === "VENDEDOR") &&
                    p.descuento > 0 && (
                      <button
                        className="ml-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                        onClick={() => handleAuthorizeClick(p)}
                      >
                        Autorizar
                      </button>
                    )}
                </td>
                <td className="px-3 py-2 text-blue-800">
                  {p.apoyoAniversario}
                </td>
                <td className="px-3 py-2 text-blue-800">{p.retencionFuente}</td>
                <td className="px-3 py-2 text-blue-800">{p.ica}</td>
                <td className="px-3 py-2 text-blue-800">{p.abono}</td>
                <td className="px-3 py-2 text-blue-800">
                  {p.registradoPor || "-"}
                </td>
                <td className="px-3 py-2 text-blue-800">
                  {userRole === "GERENTE" && (
                    <>
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
                    </>
                  )}
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
});

export default PaymentTable;
