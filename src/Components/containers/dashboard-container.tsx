import { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { authFetch } from "../../utils/authFecht";

interface Indicadores {
  carteraPendiente: number;
  pagosHoy: number;
  facturasVencidas: number;
  totalDescuentos: number;
  notasCredito: number;
}

const DashboardContainer = () => {
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIndicadores = async () => {
      setLoading(true);
      try {
        const res = await authFetch(
          `${import.meta.env.VITE_API_BASE}/dashboard/indicadores`
        );
        if (!res.ok) throw new Error("No se pudo obtener indicadores");
        const data = await res.json();
        setIndicadores(data);
      } catch {
        setIndicadores(null);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicadores();
  }, []);

  if (loading)
    return <div className="text-center py-8">Cargando dashboard...</div>;
  if (!indicadores)
    return (
      <div className="text-center py-8 text-red-600">
        No se pudieron cargar los indicadores.
      </div>
    );

  return <Dashboard indicadores={indicadores} />;
};

export default DashboardContainer;
