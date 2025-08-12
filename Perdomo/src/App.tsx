import { useState, useEffect } from "react";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import { getUserRole } from "./utils/getUserRole";
import ExcelUpload from "./Components/ExcelUpload";
import RecordPayment from "./Components/record payments";
import CarteraTable from "./Components/CarteraTable";
import AlertsVencimiento from "./Components/AlertsVencimiento";
import "./index.css";
import FacturasVencidasTable from "./Components/FacturasVencidasTable";
import PaymentHistory from "./Components/PaymentHistory";
import PaymentTable from "./Components/PaymentTable";
import type { Payment } from "./types";
import { authFetch } from "./utils/authFecht";
import SellerInvoices from "./Components/SellerInvoices";
import PaymentFilter from "./Components/PaymentFilter";

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [historialFacturaId, setHistorialFacturaId] = useState<string | null>(
    null
  );

  // NUEVO: Estado para la vista activa
  const [activeView, setActiveView] = useState<
    "pagos" | "nuevoPago" | "cartera" | "facturasVencidas" | "reporteVendedor"
  >("pagos");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUserRole(getUserRole());
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated]);

  // 1. Extrae fetchPayments fuera del useEffect
  const fetchPayments = async () => {
    try {
      const response = await authFetch(
        "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas"
      );
      if (!response.ok) {
        throw new Error("Error al obtener los pagos del backend");
      }
      const data: Payment[] = await response.json();
      setPayments(data);
    } catch (error) {
      alert("No se pudieron cargar los pagos. Intenta de nuevo.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleImportExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await authFetch(
        "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/importar-excel",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al importar el archivo Excel"
        );
      }

      alert("Archivo importado correctamente");
    } catch (error: unknown) {
      let errorMsg = "No se pudo importar el archivo. Intenta de nuevo.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      alert(errorMsg);
      console.error(error);
    }
  };

  const handleDeletePayment = async (facturaId: string) => {
    try {
      const response = await authFetch(
        `https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/${facturaId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al eliminar el pago en el backend"
        );
      }

      setPayments((prev) => prev.filter((p) => p.factura !== facturaId));
      alert("Pago eliminado correctamente");
    } catch (error: unknown) {
      let errorMsg = "No se pudo eliminar el pago. Intenta de nuevo.";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      alert(errorMsg);
      console.error(error);
    }
  };

  // Nueva función para registrar pago
  const handleRegisterPayment = async ({
    facturaId,
    valorPago,
    observaciones,
  }: {
    facturaId: string;
    valorPago: number;
    observaciones: string;
  }) => {
    try {
      const response = await authFetch(
        "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/pagos/registrar-pago",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facturaId, valorPago, observaciones }),
        }
      );
      if (!response.ok) {
        let errorMsg = "Error al registrar el pago";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Si no se puede parsear el error, usa el mensaje por defecto
        }
        throw new Error(errorMsg);
      }

      alert("Pago registrado correctamente");
      await fetchPayments();
      return true;
    } catch (error: unknown) {
      let errorMsg = "No se pudo registrar el pago";
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      alert(errorMsg);
      return false;
    }
  };

  // Filtra los pagos según el texto ingresado

  // Mostrar login/registro si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-5">
          Sistema de Pagos
        </h1>
        {showRegister ? (
          <>
            <RegisterForm
              onSuccess={() => {
                setShowRegister(false);
                alert("Registro exitoso, ahora puedes iniciar sesión.");
              }}
            />
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setShowRegister(false)}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </>
        ) : (
          <>
            <LoginForm onSuccess={() => setIsAuthenticated(true)} />
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setShowRegister(true)}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </>
        )}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("cognito_token");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen w-full p-0 m-0 bg-white">
      <AlertsVencimiento />
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-5">
        Sistema de Pagos
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <button
          onClick={() => setActiveView("nuevoPago")}
          className={`${
            activeView === "nuevoPago"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
        >
          Nuevo Pago
        </button>
        <button
          onClick={() => setActiveView("pagos")}
          className={`${
            activeView === "pagos"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
        >
          Ver Pagos
        </button>
        {/* Solo GERENTE puede importar Excel */}
        {userRole === "GERENTE" && (
          <ExcelUpload
            onImport={handleImportExcel}
            loading={loadingExcel}
            setLoading={setLoadingExcel}
            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
          />
        )}
        <button
          onClick={() => setActiveView("reporteVendedor")}
          className={`${
            activeView === "reporteVendedor"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
        >
          {activeView === "reporteVendedor"
            ? "Ocultar Reporte Vendedor"
            : "Reporte por Vendedor"}
        </button>
        <button
          onClick={() => setActiveView("cartera")}
          className={`${
            activeView === "cartera"
              ? "bg-purple-700 hover:bg-purple-800"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
        >
          {activeView === "cartera" ? "Ocultar Cartera" : "Ver Cartera"}
        </button>
        <button
          onClick={() => setActiveView("facturasVencidas")}
          className={`${
            activeView === "facturasVencidas"
              ? "bg-red-700 hover:bg-red-800"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
        >
          {activeView === "facturasVencidas"
            ? "Ocultar Facturas Vencidas"
            : "Ver Facturas Vencidas"}
        </button>
      </div>
      {/* Filtro de pagos solo cuando está activa la vista de pagos */}
      {activeView === "pagos" && (
        <PaymentFilter onFilterResult={setFilteredPayments} />
      )}
      {/* Contenido principal */}
      <div className="space-y-6 text-center flex justify-center items-start w-full">
        {activeView === "facturasVencidas" ? (
          <FacturasVencidasTable />
        ) : activeView === "cartera" ? (
          (userRole === "GERENTE" || userRole === "VENDEDOR") && (
            <CarteraTable />
          )
        ) : activeView === "reporteVendedor" ? (
          <SellerInvoices />
        ) : activeView === "nuevoPago" ? (
          (userRole === "GERENTE" ||
            userRole === "VENDEDOR" ||
            userRole === "DISTRIBUIDOR") && (
            <RecordPayment onRegister={handleRegisterPayment} />
          )
        ) : (
          <PaymentTable
            payments={
              (filteredPayments.length > 0
                ? filteredPayments
                : payments) as Payment[]
            }
            onEdit={() => setActiveView("nuevoPago")}
            onDelete={handleDeletePayment as (facturaId: string) => void}
            onHistory={(facturaId: string) => setHistorialFacturaId(facturaId)}
          />
        )}
        {historialFacturaId && (
          <PaymentHistory
            facturaId={historialFacturaId}
            onClose={() => setHistorialFacturaId(null)}
          />
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default App;
