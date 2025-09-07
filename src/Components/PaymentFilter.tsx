import { useEffect, useRef, useState } from "react";
import { authFetch } from "../utils/authFecht";
import { useToast } from "../context/use-toast";
import type { Factura } from "../types";

type Props = {
  onFilterResult: (result: Factura[]) => void;
  initialField?: "factura" | "cliente";
  initialValue?: string;
  onStateChange?: (state: {
    field: "factura" | "cliente";
    value: string;
  }) => void;
};

const fields = [
  { value: "factura", label: "Factura" },
  { value: "cliente", label: "Cliente" },
];

const API_BASE = import.meta.env.VITE_API_BASE;

export default function PaymentFilter({
  onFilterResult,
  initialField,
  initialValue,
  onStateChange,
}: Props) {
  const [value, setValue] = useState(initialValue ?? "");
  const [field, setField] = useState<"factura" | "cliente">(
    initialField && (initialField === "factura" || initialField === "cliente")
      ? initialField
      : (fields[0].value as "factura" | "cliente")
  );
  const [loading, setLoading] = useState(false);
  const debounceIdRef = useRef<number | null>(null);
  const lastRequestedRef = useRef<string | null>(null);

  // Sincronizar cuando cambian las props iniciales (p. ej., restauradas desde localStorage)
  useEffect(() => {
    if (
      initialField &&
      (initialField === "factura" || initialField === "cliente")
    ) {
      setField(initialField);
    }
    if (typeof initialValue === "string") {
      setValue(initialValue);
    }
  }, [initialField, initialValue]);

  // Notificar cambios de estado al contenedor (persistencia)
  useEffect(() => {
    onStateChange?.({ field, value });
  }, [field, value, onStateChange]);

  // Debounce de búsqueda al cambiar field/value (si value no está vacío)
  useEffect(() => {
    if (debounceIdRef.current) {
      clearTimeout(debounceIdRef.current);
      debounceIdRef.current = null;
    }
    if (value.trim() === "") return;
    debounceIdRef.current = window.setTimeout(() => {
      void handleSearch();
    }, 400);
    return () => {
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current);
        debounceIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, value]);

  const toast = useToast();
  const handleSearch = async () => {
    if (!value) return;
    // Cancelar debounce si se dispara manualmente
    if (debounceIdRef.current) {
      clearTimeout(debounceIdRef.current);
      debounceIdRef.current = null;
    }
    setLoading(true);
    try {
      const queryKey = `${field}:${value.trim()}`;
      lastRequestedRef.current = queryKey;
      const params = new URLSearchParams();
      params.append(field, value);
      const res = await authFetch(
        `${API_BASE}/facturas/buscar?${params.toString()}`
      );
      if (!res.ok) throw new Error("No se pudo buscar");
      const data = await res.json();
      // Ignorar respuestas obsoletas si hubo un cambio posterior
      if (lastRequestedRef.current !== queryKey) return;
      onFilterResult(Array.isArray(data) ? data : [data]);
    } catch {
      toast.showToast("Error al buscar facturas", "error");
      onFilterResult([]);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setField("factura");
    setValue("");
    onFilterResult([]);
    onStateChange?.({ field: "factura", value: "" });
  };

  return (
    <div className="mb-6 flex justify-center gap-2">
      <select
        value={field}
        onChange={(e) => setField(e.target.value as "factura" | "cliente")}
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
        onClick={() => void handleSearch()}
        disabled={loading || !value}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
      >
        Limpiar
      </button>
    </div>
  );
}
