import React from "react";
import { useToast } from "../context/use-toast";
import { authFetch } from "../utils/authFecht";
import { useApi } from "../hooks/useApi";
import type { CarteraFactura } from "../types";
import CarteraTableUI from "./CarteraTableUI";
import { exportToExcel } from "../utils/exportUtils";
import { apiUrl } from "../utils/api";

// const API_BASE = import.meta.env.VITE_API_BASE;

function CarteraTable() {
  const toast = useToast();
  const {
    data,
    loading,
    execute: handleLoadCartera,
  } = useApi<CarteraFactura[]>(
    async () => {
      const res = await authFetch(apiUrl(`/facturas/cartera`));
      if (!res.ok) throw new Error("No se pudo obtener la cartera");
      const raw = await res.json();
      const arr = Array.isArray(raw) ? raw : [raw];
      const data = arr.map((item) => {
        const o = (item ?? {}) as Record<string, unknown>;
        const get = (k: string) => o[k];
        return {
          facturaId: String(get("facturaId") ?? get("factura") ?? ""),
          cliente: String(get("cliente") ?? get("nombreCliente") ?? ""),
          valor: Number(get("valor") ?? get("valorFactura") ?? 0),
          saldoPendiente: Number(
            get("saldoPendiente") ??
              get("saldo_pendiente") ??
              get("saldo") ??
              get("valor") ??
              0
          ),
          fechaVencimiento: String(
            get("fechaVencimiento") ?? get("fecha_vencimiento") ?? ""
          ),
          diasMora: Number(get("diasMora") ?? get("dias_mora") ?? 0),
          color: String(get("color") ?? ""),
        } as CarteraFactura;
      });
      return data;
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
