import { useToast } from "../context/use-toast";
import { useApi } from "../hooks/useApi";
import type { FacturaVencida } from "../types";
import FacturasVencidasTableUI from "./FacturasVencidasTableUI";
import { authFetch } from "../utils/authFecht";
import { apiUrl } from "../utils/api";

// const API_BASE = import.meta.env.VITE_API_BASE;

export default function FacturasVencidasTable() {
  const toast = useToast();
  const {
    data,
    loading,
    execute: handleLoad,
  } = useApi<FacturaVencida[]>(
    async () => {
      let res = await authFetch(apiUrl(`/facturas/alertas-vencimiento`));
      if (res.status === 404) {
        const alt = await authFetch(apiUrl(`/alertas/alertas-vencimiento`));
        if (alt.ok) res = alt;
      }
      if (!res.ok) throw new Error("No se pudo obtener las facturas vencidas");
      const raw = await res.json();
      const arr = Array.isArray(raw) ? raw : [raw];
      // Adaptar nombres alternativos si el backend usa otras claves
      const normalized = arr.map((item) => {
        const o = (item ?? {}) as Record<string, unknown>;
        const get = (k: string) => o[k];
        return {
          factura: String(get("factura") ?? get("facturaId") ?? ""),
          cliente: String(get("cliente") ?? get("nombreCliente") ?? ""),
          fechaVencimiento: String(
            get("fechaVencimiento") ?? get("fecha_vencimiento") ?? ""
          ),
          diasMora: Number(get("diasMora") ?? get("dias_mora") ?? 0),
          saldoPendiente: Number(
            get("saldoPendiente") ?? get("saldo_pendiente") ?? get("saldo") ?? 0
          ),
        } as FacturaVencida;
      });
      return normalized;
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
