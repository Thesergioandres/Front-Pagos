import { useState } from "react";
import { authFetch } from "../utils/authFecht";
import { useToast } from "../context/toast-context";

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

const API_BASE = import.meta.env.VITE_API_BASE;

export default function PaymentHistory({ facturaId, onClose }: Props) {
  const [historial, setHistorial] = useState<PagoHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toast = useToast();
  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/pagos/historial/${facturaId}`);
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
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">
          Historial de Pagos - Factura {facturaId}
        </h2>
        {loading ? (
          <div>Cargando...</div>
        ) : historial.length === 0 ? (
          <div>No hay pagos registrados para esta factura.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Valor Pago</th>
                  <th>Fecha Pago</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((pago) => (
                  <tr key={pago.id}>
                    <td>{pago.id}</td>
                    <td>{pago.valorPago}</td>
                    <td>{new Date(pago.fechaPago).toLocaleString()}</td>
                    <td>{pago.observaciones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
