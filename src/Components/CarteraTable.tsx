import React from "react";
import { useToast } from "../context/use-toast";
import { authFetch } from "../utils/authFecht";
import { useApi } from "../hooks/useApi";
import type { CarteraFactura } from "../types";
import CarteraTableUI from "./CarteraTableUI";
import { exportToExcel } from "../utils/exportUtils";

const API_BASE = import.meta.env.VITE_API_BASE;

function CarteraTable() {
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
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.showToast("No hay datos para exportar", "info");
      return;
    }
    exportToExcel(data, "cartera-clientes");
    toast.showToast("Exportación exitosa", "success");
  };

  return (
    <CarteraTableUI
      data={data || []}
      loading={loading}
      onReload={handleLoadCartera}
      onExport={handleExport}
    />
  );
}

export default React.memo(CarteraTable);
