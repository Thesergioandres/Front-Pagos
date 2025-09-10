import { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";

interface RecordPaymentProps {
  onRegister: (data: {
    facturaId: string;
    valorPago: number;
    observaciones: string;
    cuentaDestino: string;
    notaCredito: string;
    comprobante?: File | null;
  }) => Promise<boolean>;
  usuarioActual?: string; // Para auditoría
}

const RecordPayment: React.FC<RecordPaymentProps> = ({
  onRegister,
  usuarioActual,
}) => {
  const [facturaId, setFacturaId] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [cuentaDestino, setCuentaDestino] = useState("");
  const [notaCredito, setNotaCredito] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ok = await onRegister({
      facturaId,
      valorPago: parseFloat(valorPago),
      observaciones,
      cuentaDestino,
      notaCredito,
      comprobante,
    });

    if (ok) {
      setFacturaId("");
      setValorPago("");
      setObservaciones("");
      setCuentaDestino("");
      setNotaCredito("");
      setComprobante(null);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg md:max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
      <div>
        <label className="block text-gray-700">ID de Factura</label>
        <Input
          type="text"
          value={facturaId}
          onChange={(e) => setFacturaId(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Valor del Pago</label>
        <Input
          type="number"
          step="0.01"
          value={valorPago}
          onChange={(e) => setValorPago(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Cuenta a la que se transfirió
        </label>
        <Input
          type="text"
          value={cuentaDestino}
          onChange={(e) => setCuentaDestino(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700">Notas crédito</label>
        <Input
          type="text"
          value={notaCredito}
          onChange={(e) => setNotaCredito(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Comprobante de Pago (opcional)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setComprobante(e.target.files?.[0] || null)}
          className="w-full border rounded px-3 py-2"
        />
        {comprobante && (
          <div className="text-xs text-gray-600 mt-1">
            Archivo seleccionado: {comprobante.name}
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading} isLoading={loading}>
        {loading ? "Registrando..." : "Registrar Pago"}
      </Button>
      {/* Auditoría: mostrar usuario que registra el pago */}
      {usuarioActual && (
        <div className="text-xs text-gray-500 mt-2">
          Registrado por: {usuarioActual}
        </div>
      )}
    </form>
  );
};

export default RecordPayment;
