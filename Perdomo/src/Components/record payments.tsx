import { useState } from "react";

interface RecordPaymentProps {
  onRegister: (data: {
    facturaId: string;
    valorPago: number;
    observaciones: string;
  }) => Promise<boolean>;
}

const RecordPayment: React.FC<RecordPaymentProps> = ({ onRegister }) => {
  const [facturaId, setFacturaId] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ok = await onRegister({
      facturaId,
      valorPago: parseFloat(valorPago),
      observaciones,
    });

    if (ok) {
      setFacturaId("");
      setValorPago("");
      setObservaciones("");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
      <div>
        <label className="block text-gray-700">ID de Factura</label>
        <input
          type="text"
          value={facturaId}
          onChange={(e) => setFacturaId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-gray-700">Valor del Pago</label>
        <input
          type="number"
          step="0.01"
          value={valorPago}
          onChange={(e) => setValorPago(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
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
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Registrando..." : "Registrar Pago"}
      </button>
    </form>
  );
};

export default RecordPayment;
