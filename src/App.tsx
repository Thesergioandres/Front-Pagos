import { useEffect, useState, useCallback } from "react";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./context/use-auth";
import "./index.css";
import { lazy, Suspense } from "react";
import {
  LAST_VIEW_KEY,
  type View,
  DEFAULT_VIEW,
  parseView,
  LAST_PAYMENTS_FILTER_KEY,
  parsePaymentsFilter,
} from "./utils/constants";
const LoginForm = lazy(() => import("./Components/auth/login-form"));
const RegisterForm = lazy(() => import("./Components/auth/register-form"));
const ExcelUpload = lazy(() => import("./Components/ExcelUpload"));
const RecordPayment = lazy(() => import("./Components/record-payments"));
const CarteraTable = lazy(() => import("./Components/CarteraTable"));
const AlertsVencimiento = lazy(() => import("./Components/AlertsVencimiento"));
const FacturasVencidasTable = lazy(
  () => import("./Components/FacturasVencidasTable")
);
const PaymentHistory = lazy(() => import("./Components/PaymentHistory"));
const PaymentTable = lazy(() => import("./Components/PaymentTable"));
import type { Payment } from "./types";
import { authFetch, UnauthorizedError } from "./utils/authFecht";
const SellerInvoices = lazy(() => import("./Components/SellerInvoices"));
const DashboardContainer = lazy(
  () => import("./Components/containers/dashboard-container")
);
const PaymentFilter = lazy(() => import("./Components/PaymentFilter"));
import { ToastProvider } from "./context/toast-context";
import { useToast } from "./context/use-toast";
import Spinner from "./Components/ui/Spinner";

const API_BASE = import.meta.env.VITE_API_BASE as string;

function AppContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [historialFacturaId, setHistorialFacturaId] = useState<string | null>(
    null
  );

  const [activeView, setActiveView] = useState<View>(() => {
    try {
      const v = localStorage.getItem(LAST_VIEW_KEY);
      return parseView(v ?? DEFAULT_VIEW);
    } catch {
      return DEFAULT_VIEW;
    }
  });
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, setIsAuthenticated, userRole, logout } = useAuth();
  const toast = useToast();
  // Estado inicial del filtro persistido
  const [initialFilterField, setInitialFilterField] = useState<
    "factura" | "cliente" | undefined
  >(undefined);
  const [initialFilterValue, setInitialFilterValue] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_PAYMENTS_FILTER_KEY);
      const pf = parsePaymentsFilter(saved);
      if (pf) {
        setInitialFilterField(pf.field);
        setInitialFilterValue(pf.value);
      }
    } catch {
      // noop
    }
  }, []);
  // Prefetch por interacción (hover/focus) de vistas
  const prefetchPagos = () => {
    import("./Components/PaymentTable");
    import("./Components/PaymentFilter");
    import("./Components/PaymentHistory");
  };
  const prefetchFacturasVencidas = () => {
    import("./Components/FacturasVencidasTable");
  };
  const prefetchCartera = () => {
    import("./Components/CarteraTable");
  };
  const prefetchReporteVendedor = () => {
    import("./Components/SellerInvoices");
  };
  const prefetchNuevoPago = () => {
    import("./Components/record-payments");
  };

  // Guardar última vista
  useEffect(() => {
    try {
      localStorage.setItem(LAST_VIEW_KEY, activeView);
    } catch (e) {
      if (import.meta.env.DEV) console.debug("No se pudo guardar last_view", e);
    }
  }, [activeView]);
  // Prefetch de vistas comunes tras autenticación
  useEffect(() => {
    if (isAuthenticated) {
      import("./Components/PaymentTable");
      import("./Components/PaymentFilter");
      import("./Components/PaymentHistory");
      if (userRole === "GERENTE") {
        import("./Components/containers/dashboard-container");
      }
      // Prefetch por última vista usada
      try {
        const last = localStorage.getItem(LAST_VIEW_KEY);
        switch (last) {
          case "facturasVencidas":
            prefetchFacturasVencidas();
            break;
          case "cartera":
            prefetchCartera();
            break;
          case "reporteVendedor":
            prefetchReporteVendedor();
            break;
          case "nuevoPago":
            prefetchNuevoPago();
            break;
          case "pagos":
          default:
            prefetchPagos();
            break;
        }
      } catch (e) {
        if (import.meta.env.DEV) console.debug("Prefetch last_view falló", e);
      }
    }
  }, [isAuthenticated, userRole]);

  // 1. Extrae fetchPayments fuera del useEffect

  const fetchPayments = useCallback(async () => {
    try {
      const response = await authFetch(`${API_BASE}/facturas`);
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
      const response = await authFetch(`${API_BASE}/facturas/importar-excel`, {
        method: "POST",
        body: formData,
      });
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
      const response = await authFetch(`${API_BASE}/facturas/${facturaId}`, {
        method: "DELETE",
      });
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
      const response = await authFetch(`${API_BASE}/pagos/registrar-pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facturaId, valorPago, observaciones }),
      });
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
            <Suspense fallback={<Spinner label="Cargando registro..." />}>
              <RegisterForm
                onSuccess={() => {
                  setShowRegister(false);
                  toast.showToast(
                    "Registro exitoso, ahora puedes iniciar sesión.",
                    "success"
                  );
                }}
              />
            </Suspense>
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setShowRegister(false)}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </>
        ) : (
          <>
            <Suspense fallback={<Spinner label="Cargando login..." />}>
              <LoginForm onSuccess={() => setIsAuthenticated(true)} />
            </Suspense>
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
      <Suspense fallback={<Spinner label="Cargando alertas..." />}>
        <AlertsVencimiento />
      </Suspense>
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-5">
        Sistema de Pagos
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <button
          onClick={() => setActiveView("nuevoPago")}
          onMouseEnter={prefetchNuevoPago}
          onFocus={prefetchNuevoPago}
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
          onMouseEnter={prefetchPagos}
          onFocus={prefetchPagos}
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
          <Suspense fallback={<Spinner label="Cargando importador..." />}>
            <ExcelUpload
              onImport={handleImportExcel}
              loading={loadingExcel}
              setLoading={setLoadingExcel}
            />
          </Suspense>
        )}
        <button
          onClick={() => setActiveView("reporteVendedor")}
          onMouseEnter={prefetchReporteVendedor}
          onFocus={prefetchReporteVendedor}
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
          onMouseEnter={prefetchCartera}
          onFocus={prefetchCartera}
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
          onMouseEnter={prefetchFacturasVencidas}
          onFocus={prefetchFacturasVencidas}
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
        <Suspense fallback={<Spinner label="Cargando filtro..." />}>
          <PaymentFilter
            onFilterResult={setFilteredPayments}
            initialField={initialFilterField}
            initialValue={initialFilterValue}
            onStateChange={(state) => {
              try {
                if (state.value && state.value.trim() !== "") {
                  localStorage.setItem(
                    LAST_PAYMENTS_FILTER_KEY,
                    JSON.stringify(state)
                  );
                } else {
                  localStorage.removeItem(LAST_PAYMENTS_FILTER_KEY);
                }
              } catch {
                // noop
              }
            }}
          />
        </Suspense>
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
              <Suspense fallback={<Spinner label="Cargando dashboard..." />}>
                <DashboardContainer />
              </Suspense>
            </div>
          </div>
        ) : activeView === "facturasVencidas" ? (
          <Suspense
            fallback={<Spinner label="Cargando facturas vencidas..." />}
          >
            <FacturasVencidasTable />
          </Suspense>
        ) : activeView === "cartera" ? (
          (userRole === "GERENTE" || userRole === "VENDEDOR") && (
            <Suspense fallback={<Spinner label="Cargando cartera..." />}>
              <CarteraTable />
            </Suspense>
          )
        ) : activeView === "reporteVendedor" ? (
          (() => {
            console.log("[Reporte por vendedor] Renderizando SellerInvoices");
            return (
              <Suspense fallback={<Spinner label="Cargando reporte..." />}>
                <SellerInvoices />
              </Suspense>
            );
          })()
        ) : activeView === "nuevoPago" ? (
          (() => {
            console.log("[Nuevo pago] Renderizando RecordPayment");
            return (
              (userRole === "GERENTE" ||
                userRole === "VENDEDOR" ||
                userRole === "DISTRIBUIDOR") && (
                <Suspense fallback={<Spinner label="Cargando formulario..." />}>
                  <RecordPayment onRegister={handleRegisterPayment} />
                </Suspense>
              )
            );
          })()
        ) : (
          // Mostrar tabla de pagos si la vista activa es 'pagos'
          activeView === "pagos" && (
            <Suspense fallback={<Spinner label="Cargando pagos..." />}>
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
            </Suspense>
          )
        )}
        {historialFacturaId && (
          <Suspense fallback={<Spinner label="Cargando historial..." />}>
            <PaymentHistory
              facturaId={historialFacturaId}
              onClose={() => setHistorialFacturaId(null)}
            />
          </Suspense>
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
