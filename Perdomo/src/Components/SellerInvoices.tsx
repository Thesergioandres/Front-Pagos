import { useState } from "react";
import { authFetch } from "../utils/authFecht"; // <--- Importa authFetch

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

export default function SellerInvoices() {
  const [nombre, setNombre] = useState("");
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        `https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/reporte/vendedor/${nombre}`
      );
      if (!res.ok) throw new Error("No se pudo obtener el reporte");
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : [data]);
    } catch {
      alert("Error al buscar facturas del vendedor");
      setFacturas([]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Nombre del vendedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
          disabled={loading || !nombre}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
      {facturas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Población</th>
                <th>Cond. Pago</th>
                <th>Fecha</th>
                <th>Saldo</th>
                <th>Vendedor</th>
                <th>Observación</th>
                <th>Estado</th>
                <th>Descuento</th>
                <th>Apoyo Aniv.</th>
                <th>Ret. Fuente</th>
                <th>ICA</th>
                <th>Abono</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.factura}>
                  <td>{f.factura}</td>
                  <td>{f.codigo}</td>
                  <td>{f.cliente}</td>
                  <td>{f.tipoFactura}</td>
                  <td>{f.valorFactura}</td>
                  <td>{f.poblacion}</td>
                  <td>{f.condicionPago}</td>
                  <td>{f.fechaFactura}</td>
                  <td>{f.saldo}</td>
                  <td>{f.vendedor}</td>
                  <td>{f.observacion}</td>
                  <td>{f.estado}</td>
                  <td>{f.descuento}</td>
                  <td>{f.apoyoAniversario}</td>
                  <td>{f.retencionFuente}</td>
                  <td>{f.ica}</td>
                  <td>{f.abono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
