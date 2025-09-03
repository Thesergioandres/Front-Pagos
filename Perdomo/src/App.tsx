import { useEffect, useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/auth-context";
import LoginForm from "./Components/auth/login-form";
import RegisterForm from "./Components/auth/register-form";
import ExcelUpload from "./Components/ExcelUpload";
import RecordPayment from "./Components/record payments";
import CarteraTable from "./Components/CarteraTable";
import AlertsVencimiento from "./Components/AlertsVencimiento";
import "./index.css";
import FacturasVencidasTable from "./Components/FacturasVencidasTable";
import PaymentHistory from "./Components/PaymentHistory";
import PaymentTable from "./Components/PaymentTable";
import type { Payment } from "./types";
import { authFetch, UnauthorizedError } from "./utils/authFecht";
import SellerInvoices from "./Components/SellerInvoices";
import DashboardContainer from "./Components/containers/dashboard-container";
import PaymentFilter from "./Components/PaymentFilter";
import { useToast, ToastProvider } from "./context/toast-context";

function AppContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [historialFacturaId, setHistorialFacturaId] = useState<string | null>(
    null
  );

  const [activeView, setActiveView] = useState<
    | "pagos"
    | "nuevoPago"
    | "cartera"
    | "facturasVencidas"
    | "reporteVendedor"
    | "dashboard"
  >("pagos");
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, setIsAuthenticated, userRole, logout } = useAuth();
  const toast = useToast();

  // 1. Extrae fetchPayments fuera del useEffect

  const fetchPayments = useCallback(async () => {
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
      if (error instanceof UnauthorizedError) {
        logout();
        toast.showToast(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
      } else if (error instanceof Error && error.message.includes("504")) {
        toast.showToast(
          "El servidor está tardando demasiado en responder. Intenta de nuevo más tarde o contacta al administrador.",
          "error"
        );
        console.error(error);
      } else {
        toast.showToast(
          "No se pudieron cargar los pagos. Intenta de nuevo.",
          "error"
        );
        console.error(error);
      }
    }
  }, [toast, logout]);

  const handleImportExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Log para mostrar el contenido del FormData
    for (const pair of formData.entries()) {
      console.log(`[handleImportExcel] FormData: ${pair[0]} =`, pair[1]);
    }
    setLoadingExcel(true);
    try {
      const response = await authFetch(
        "https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/importar-excel",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        let errorMsg = "Error al importar el archivo Excel";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Error intentionally ignored
        }
        toast.showToast(errorMsg, "error");
        return;
      }
      // Log de la respuesta del backend
      try {
        const responseData = await response.json();
        console.log(
          "[handleImportExcel] Respuesta del backend (JSON):",
          responseData
        );
      } catch {
        try {
          const responseText = await response.text();
          console.log(
            "[handleImportExcel] Respuesta del backend (texto):",
            responseText
          );
        } catch {
          console.log(
            "[handleImportExcel] No se pudo leer la respuesta del backend como texto"
          );
        }
      }
      toast.showToast("Archivo importado correctamente", "success");
      await fetchPayments();
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        logout();
        toast.showToast(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
      } else {
        let errorMsg = "No se pudo importar el archivo. Intenta de nuevo.";
        if (error instanceof Error) {
          errorMsg = error.message;
        }
        toast.showToast(errorMsg, "error");
        console.error(error);
      }
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleDeletePayment = async (facturaId: string) => {
    try {
      const response = await authFetch(
        `https://sfjr0up5ok.execute-api.us-east-2.amazonaws.com/deploy/perdomo-api/api/facturas/${facturaId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        let errorMsg = "No se pudo eliminar el pago. Intenta de nuevo.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Error intentionally ignored
        }
        toast.showToast(errorMsg, "error");
        return;
      }
      setPayments((prev) => prev.filter((p) => p.factura !== facturaId));
      toast.showToast("Pago eliminado correctamente", "success");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        logout();
        toast.showToast(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
      } else {
        let errorMsg = "No se pudo eliminar el pago. Intenta de nuevo.";
        if (error instanceof Error) {
          errorMsg = error.message;
        }
        toast.showToast(errorMsg, "error");
        console.error(error);
      }
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
          // Error intentionally ignored
        }
        toast.showToast(errorMsg, "error");
        return false;
      }
      toast.showToast("Pago registrado correctamente", "success");
      await fetchPayments();
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        logout();
        toast.showToast(
          "Sesión expirada. Por favor, inicia sesión de nuevo.",
          "error"
        );
      } else {
        let errorMsg = "No se pudo registrar el pago";
        if (error instanceof Error) {
          errorMsg = error.message;
        }
        toast.showToast(errorMsg, "error");
        console.error(error);
      }
      return false;
    }
  };

  // Cargar pagos al iniciar sesión
  useEffect(() => {
    if (isAuthenticated) {
      fetchPayments();
    }
  }, [isAuthenticated, fetchPayments]);

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
                toast.showToast(
                  "Registro exitoso, ahora puedes iniciar sesión.",
                  "success"
                );
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
        {userRole === "GERENTE" && (
          <button
            onClick={() => setActiveView("dashboard")}
            className={`$ {
              activeView === "dashboard"
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
          >
            {activeView === "dashboard"
              ? "Ocultar Dashboard"
              : "Dashboard Financiero"}
          </button>
        )}
      </div>
    );
  }

  // Mostrar el rol del usuario en la UI
  const roleLabel = userRole
    ? userRole.charAt(0) + userRole.slice(1).toLowerCase()
    : "";

  return (
    <div className="min-h-screen w-full p-0 m-0 bg-white">
      {/* Barra superior con rol */}
      <div className="w-full flex justify-end items-center px-6 pt-4">
        {isAuthenticated && (
          <span className="text-xs md:text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded px-3 py-1 shadow-sm">
            Rol: <b>{roleLabel}</b>
          </span>
        )}
      </div>
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
        {/* Mostrar el botón de importar Excel para todos los roles */}
        {userRole === "GERENTE" && (
          <ExcelUpload
            onImport={handleImportExcel}
            loading={loadingExcel}
            setLoading={setLoadingExcel}
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
        {/* Log para depuración de pagos */}
        {activeView === "pagos" &&
          (() => {
            const pagosMostrados =
              filteredPayments.length > 0 ? filteredPayments : payments;
            console.log("[Pagos] Mostrando en tabla:", pagosMostrados);
            return null;
          })()}
        {activeView === "dashboard" && userRole === "GERENTE" ? (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl">
              <DashboardContainer />
            </div>
          </div>
        ) : activeView === "facturasVencidas" ? (
          <FacturasVencidasTable />
        ) : activeView === "cartera" ? (
          (userRole === "GERENTE" || userRole === "VENDEDOR") && (
            <CarteraTable />
          )
        ) : activeView === "reporteVendedor" ? (
          (() => {
            console.log("[Reporte por vendedor] Renderizando SellerInvoices");
            return <SellerInvoices />;
          })()
        ) : activeView === "nuevoPago" ? (
          (() => {
            console.log("[Nuevo pago] Renderizando RecordPayment");
            return (
              (userRole === "GERENTE" ||
                userRole === "VENDEDOR" ||
                userRole === "DISTRIBUIDOR") && (
                <RecordPayment onRegister={handleRegisterPayment} />
              )
            );
          })()
        ) : (
          // Mostrar tabla de pagos si la vista activa es 'pagos'
          activeView === "pagos" && (
            <PaymentTable
              payments={
                (filteredPayments.length > 0
                  ? filteredPayments
                  : payments) as Payment[]
              }
              onEdit={() => setActiveView("nuevoPago")}
              onDelete={handleDeletePayment as (facturaId: string) => void}
              onHistory={(facturaId: string) =>
                setHistorialFacturaId(facturaId)
              }
            />
          )
        )}
        {historialFacturaId && (
          <PaymentHistory
            facturaId={historialFacturaId}
            onClose={() => setHistorialFacturaId(null)}
          />
        )}
      </div>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
