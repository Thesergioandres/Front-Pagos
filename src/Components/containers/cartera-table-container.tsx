import { useToast } from "../../context/use-toast";
import { useApi } from "../../hooks/useApi";
import { authFetch } from "../../utils/authFecht";
import type { CarteraFactura } from "../../types";
import CarteraTableUI from "../ui/cartera-table-ui";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CarteraTableContainer() {
  const toast = useToast();
  const {
    data,
    loading,
    execute: handleLoadCartera,
  } = useApi<CarteraFactura[]>(
    async () => {
      const res = await authFetch(`${API_BASE}/facturas/cartera`);
      if (!res.ok) throw new Error("No se pudo obtener la cartera");
      const result = await res.json();
      return Array.isArray(result) ? result : [result];
    },
    {
      onError: () => toast.showToast("Error al cargar la cartera", "error"),
    }
  );
  return (
    <CarteraTableUI
      data={data || []}
      loading={loading}
      onReload={handleLoadCartera}
    />
  );
}
