import { useToast } from "../../context/use-toast";
import { useApi } from "../../hooks/useApi";
import type { FacturaVencida } from "../../types";
import { authFetch } from "../../utils/authFecht";
import FacturasVencidasTableUI from "../ui/facturas-vencidas-table-ui";
import { useAuth } from "../../context/use-auth";

const API_BASE = import.meta.env.VITE_API_BASE;

const FacturasVencidasTableContainer = () => {
  const toast = useToast();
  const { userRole } = useAuth();
  const {
    data,
    loading,
    execute: handleLoad,
  } = useApi<FacturaVencida[]>(
    async () => {
      console.log("[DEBUG] Rol actual:", userRole);
      const res = await authFetch(`${API_BASE}/facturas/alertas-vencimiento`);
      if (!res.ok) throw new Error("No se pudo obtener las facturas vencidas");
      const result = await res.json();
      console.log("[DEBUG] Respuesta API facturas vencidas:", result);
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
};

export default FacturasVencidasTableContainer;
