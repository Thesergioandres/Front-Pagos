import { useState } from "react";
import { useToast } from "../../context/use-toast";
import { useApi } from "../../hooks/useApi";
import type { Factura } from "../../types";
import SellerInvoicesUI from "../ui/seller-invoices-ui";
import { authFetch } from "../../utils/authFecht";
import { apiUrl } from "../../utils/api";

export default function SellerInvoicesContainer() {
  const [nombre, setNombre] = useState("");
  const toast = useToast();
  const {
    data,
    loading,
    execute: handleSearch,
  } = useApi<Factura[]>(
    async () => {
      if (!nombre) return [];
      const res = await authFetch(apiUrl(`/reportes/vendedor/${nombre}`));
      if (!res.ok) throw new Error("No se pudo obtener el reporte");
      const result = await res.json();
      return Array.isArray(result) ? result : [result];
    },
    {
      onError: () =>
        toast.showToast("Error al buscar facturas del vendedor", "error"),
    }
  );
  return (
    <SellerInvoicesUI
      data={data || []}
      loading={loading}
      onReload={handleSearch}
      nombre={nombre}
      setNombre={setNombre}
    />
  );
}
