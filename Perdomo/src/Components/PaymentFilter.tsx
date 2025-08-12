import { useState } from "react";
import { authFetch } from "../utils/authFecht";

type Factura = {
  factura: string;
  codigo: string;
  cliente: string;
  tipoFactura: string;
  valorFactura: number;
  poblacion: string;
  condicionPago: string;
  fechaFactura: string;
  saldo: number;
  vendedor: string;
  observacion: string;
  estado: string;
  descuento: number;
  apoyoAniversario: number;
  retencionFuente: number;
  ica: number;
  abono: number;
};

type Props = {
  onFilterResult: (result: Factura[]) => void;
};

const fields = [
  { value: "factura", label: "Factura" },
  { value: "cliente", label: "Cliente" },
];

export default function PaymentFilter({ onFilterResult }: Props) {
  const [value, setValue] = useState("");
  const [field, setField] = useState(fields[0].value);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append(field, value);
      const res = await authFetch(
        `https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/buscar?${params.toString()}`
      );
      if (!res.ok) throw new Error("No se pudo buscar");
      const data = await res.json();
      onFilterResult(Array.isArray(data) ? data : [data]);
    } catch {
      alert("Error al buscar facturas");
      onFilterResult([]);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6 flex justify-center gap-2">
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="px-3 py-2 border border-blue-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {fields.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Buscar por ${
          fields.find((f) => f.value === field)?.label
        }...`}
        className="w-80 px-4 py-2 border border-blue-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={handleSearch}
        disabled={loading || !value}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}
