import React from "react";

interface DashboardProps {
  indicadores: {
    carteraPendiente: number;
    pagosHoy: number;
    facturasVencidas: number;
    totalDescuentos: number;
    notasCredito: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ indicadores }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      <div className="bg-blue-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-blue-800">Cartera Pendiente</h3>
        <p className="text-2xl font-semibold">
          ${indicadores.carteraPendiente.toLocaleString()}
        </p>
      </div>
      <div className="bg-green-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-green-800">Pagos Hoy</h3>
        <p className="text-2xl font-semibold">
          ${indicadores.pagosHoy.toLocaleString()}
        </p>
      </div>
      <div className="bg-red-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-red-800">Facturas Vencidas</h3>
        <p className="text-2xl font-semibold">
          ${indicadores.facturasVencidas.toLocaleString()}
        </p>
      </div>
      <div className="bg-yellow-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-yellow-800">Total Descuentos</h3>
        <p className="text-2xl font-semibold">
          ${indicadores.totalDescuentos.toLocaleString()}
        </p>
      </div>
      <div className="bg-purple-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-purple-800">Notas Crédito</h3>
        <p className="text-2xl font-semibold">
          ${indicadores.notasCredito.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
