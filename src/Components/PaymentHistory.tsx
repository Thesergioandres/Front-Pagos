import { useState } from "react";
import { authFetch } from "../utils/authFecht";
import { useToast } from "../context/use-toast";
import { apiUrl } from "../utils/api";
import Button from "./ui/Button";
import { TableContainer } from "./ui/table";
import { tableClasses } from "./ui/tableClasses";

type PagoHistorial = {
  id: number;
  factura: string;
  valorPago: number;
  fechaPago: string;
  observaciones: string;
};

type Props = {
  facturaId: string;
  onClose: () => void;
};

export default function PaymentHistory({ facturaId, onClose }: Props) {
  const [historial, setHistorial] = useState<PagoHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toast = useToast();
  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const res = await authFetch(apiUrl(`/pagos/historial/${facturaId}`));
      if (!res.ok) throw new Error("No se pudo obtener el historial");
      const data = await res.json();
      setHistorial(Array.isArray(data) ? data : [data]);
      setLoaded(true);
    } catch {
      toast.showToast("Error al cargar el historial de pagos", "error");
      setHistorial([]);
    }
    setLoading(false);
  };

  // Cargar historial solo la primera vez que se abre
  if (!loaded && !loading) fetchHistorial();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <Button
          onClick={onClose}
          className="!bg-transparent absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </Button>
        <h2 className="text-lg font-bold mb-4">
          Historial de Pagos - Factura {facturaId}
        </h2>
        {loading ? (
          <div>Cargando...</div>
        ) : historial.length === 0 ? (
          <div>No hay pagos registrados para esta factura.</div>
        ) : (
          <TableContainer maxHeight={320}>
            <table className={`min-w-full ${tableClasses.table}`}>
              <thead>
                <tr className={tableClasses.headRow}>
                  <th className={tableClasses.th}>ID</th>
                  <th className={tableClasses.th}>Valor Pago</th>
                  <th className={tableClasses.th}>Fecha Pago</th>
                  <th className={tableClasses.th}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((pago) => (
                  <tr key={pago.id} className={tableClasses.tr}>
                    <td className={tableClasses.td}>{pago.id}</td>
                    <td className={tableClasses.td}>{pago.valorPago}</td>
                    <td className={tableClasses.td}>
                      {new Date(pago.fechaPago).toLocaleString()}
                    </td>
                    <td className={tableClasses.td}>{pago.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
