import type { Payment } from "../types";

type Props = {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (facturaId: string) => void;
  onHistory: (facturaId: string) => void; // Nueva prop
};

import React, { useState } from "react";
import { useAuth } from "../context/use-auth";
import Button from "./ui/Button";
import { TableContainer } from "./ui/table";
import { tableClasses } from "./ui/tableClasses";

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
            <h3 className="text-lg font-bold mb-2 text-brand-800">
              Autorizar descuento
            </h3>
            <p className="mb-4">
              Factura: <b>{selectedPayment.factura}</b>
            </p>
            <p className="mb-4">
              Descuento solicitado: <b>${selectedPayment.descuento}</b>
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="success" onClick={handleAuthorize}>
                Autorizar
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      <TableContainer className="mx-auto">
        <table
          className={`min-w-[900px] md:min-w-[1200px] ${tableClasses.table}`}
        >
          <thead>
            <tr className={tableClasses.headRow}>
              <th className={tableClasses.th}>Factura</th>
              <th className={tableClasses.th}>Código</th>
              <th className={tableClasses.th}>Cliente</th>
              <th className={tableClasses.th}>Tipo Factura</th>
              <th className={tableClasses.th}>Valor Factura</th>
              <th className={tableClasses.th}>Población</th>
              <th className={tableClasses.th}>Condición Pago</th>
              <th className={tableClasses.th}>Fecha Factura</th>
              <th className={tableClasses.th}>Saldo</th>
              <th className={tableClasses.th}>Vendedor</th>
              <th className={tableClasses.th}>Observación</th>
              <th className={tableClasses.th}>Estado</th>
              <th className={tableClasses.th}>Descuento</th>
              <th className={tableClasses.th}>Apoyo Aniversario</th>
              <th className={tableClasses.th}>Retención Fuente</th>
              <th className={tableClasses.th}>ICA</th>
              <th className={tableClasses.th}>Abono</th>
              <th className={tableClasses.th}>Registrado por</th>
              <th className={tableClasses.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className={tableClasses.tr}>
                <td className={tableClasses.td}>{p.factura}</td>
                <td className={tableClasses.td}>{p.codigo}</td>
                <td className={tableClasses.td}>{p.cliente}</td>
                <td className={tableClasses.td}>{p.tipoFactura}</td>
                <td className={tableClasses.td}>{p.valorFactura}</td>
                <td className={tableClasses.td}>{p.poblacion}</td>
                <td className={tableClasses.td}>{p.condicionPago}</td>
                <td className={tableClasses.td}>{p.fechaFactura}</td>
                <td className={tableClasses.td}>{p.saldo}</td>
                <td className={tableClasses.td}>{p.vendedor}</td>
                <td className={tableClasses.td}>{p.observacion}</td>
                <td className={tableClasses.td}>{p.estado}</td>
                <td className={`${tableClasses.td} flex items-center gap-2`}>
                  {p.descuento}
                  {/* Solo gerente o vendedor puede solicitar autorización */}
                  {(userRole === "GERENTE" || userRole === "VENDEDOR") &&
                    p.descuento > 0 && (
                      <Button
                        className="ml-2 !px-2 !py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => handleAuthorizeClick(p)}
                      >
                        Autorizar
                      </Button>
                    )}
                </td>
                <td className={tableClasses.td}>{p.apoyoAniversario}</td>
                <td className={tableClasses.td}>{p.retencionFuente}</td>
                <td className={tableClasses.td}>{p.ica}</td>
                <td className={tableClasses.td}>{p.abono}</td>
                <td className={tableClasses.td}>{p.registradoPor || "-"}</td>
                <td className={tableClasses.td}>
                  {userRole === "GERENTE" && (
                    <>
                      <Button
                        variant="success"
                        onClick={() => onEdit(p)}
                        className="!bg-transparent text-green-600 hover:text-green-800 hover:underline"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onDelete(p.factura)}
                        className="!bg-transparent text-red-600 hover:text-red-800 hover:underline ml-2"
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => onHistory(p.factura)}
                    className="!bg-transparent text-brand-600 hover:text-brand-800 hover:underline ml-2"
                  >
                    Ver historial
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
});

export default PaymentTable;
