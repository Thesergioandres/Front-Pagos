import { useToast } from "../../context/toast-context";
import { useApi } from "../../hooks/useApi";
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
      const res = await fetch(`${API_BASE}/facturas/cartera`, {
        credentials: "include",
      });
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
