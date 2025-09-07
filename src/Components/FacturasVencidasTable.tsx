import { useToast } from "../context/use-toast";
import { useApi } from "../hooks/useApi";
import type { FacturaVencida } from "../types";
import FacturasVencidasTableUI from "./FacturasVencidasTableUI";
import { authFetch } from "../utils/authFecht";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function FacturasVencidasTable() {
  const toast = useToast();
  const {
    data,
    loading,
    execute: handleLoad,
  } = useApi<FacturaVencida[]>(
    async () => {
      const res = await authFetch(`${API_BASE}/facturas/alertas-vencimiento`);
      if (!res.ok) throw new Error("No se pudo obtener las facturas vencidas");
      const result = await res.json();
      return Array.isArray(result) ? result : [result];
    },
    {
      onError: () =>
        toast.showToast("Error al cargar las facturas vencidas", "error"),
    }
  );
  return (
    <FacturasVencidasTableUI
      data={data || []}
      loading={loading}
      onReload={handleLoad}
    />
  );
}
