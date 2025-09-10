import { useEffect, useState, useCallback, useRef } from "react";
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
import ApiDebugOverlay from "./Components/ui/ApiDebugOverlay";
import { apiUrl } from "./utils/api";
import Button from "./Components/ui/Button";

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
  // Refs para estabilizar dependencias en callbacks/efectos
  const toastRef = useRef(toast);
  const logoutRef = useRef(logout);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);
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
        setInitialFilterField(pf.field as "factura" | "cliente");
        setInitialFilterValue(pf.value);
      }
    } catch {
      // noop
    }
  }, []);
  // Helpers de prefetch para navegación
  const prefetchPagos = () => {
    import("./Components/PaymentTable");
    import("./Components/PaymentFilter");
    import("./Components/PaymentHistory");
  };
  const prefetchNuevoPago = () => {
    import("./Components/record-payments");
  };
  const prefetchReporteVendedor = () => {
    import("./Components/SellerInvoices");
  };
  const prefetchCartera = () => {
    import("./Components/CarteraTable");
  };
  const prefetchFacturasVencidas = () => {
    import("./Components/FacturasVencidasTable");
  };
  const fetchAbortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      // Cancelar cualquier request al desmontar (p.ej., StrictMode en dev)
      try {
        fetchAbortRef.current?.abort("unmount");
      } catch {
        // noop
      }
    };
  }, []);

  // Guardar última vista
  useEffect(() => {
    try {
      localStorage.setItem(LAST_VIEW_KEY, activeView);
    } catch (e) {
      if (import.meta.env.DEV) console.debug("No se pudo guardar last_view", e);
    }
  }, [activeView]);

  // 1. Extrae fetchPayments fuera del useEffect

  const fetchPayments = useCallback(async () => {
    const envLimitRaw = import.meta.env.VITE_FACTURAS_LIMIT as unknown as
      | string
      | undefined;
    const initialLimit = Number(envLimitRaw);

    const attempt = async (attemptNo: number): Promise<void> => {
      const controller = new AbortController();
      // Cancela petición previa si existía
      try {
        fetchAbortRef.current?.abort("replaced");
      } catch {
        // noop
      }
      fetchAbortRef.current = controller;

      try {
        let url = apiUrl(`/facturas`);
        let limitToUse: number | undefined;

        if (attemptNo === 0) {
          // Primer intento: usar configuración normal
          if (!isNaN(initialLimit) && initialLimit > 0) {
            limitToUse = initialLimit;
          }
        } else if (attemptNo === 1) {
          // Segundo intento tras 504: límite muy reducido
          limitToUse = 50;
          if (import.meta.env.DEV) {
            console.warn(
              `[fetchPayments] Segundo intento tras 504: limit=${limitToUse}`
            );
          }
        } else {
          // Tercer intento: solo las primeras 10 facturas
          limitToUse = 10;
          if (import.meta.env.DEV) {
            console.warn(`[fetchPayments] Tercer intento: limit=${limitToUse}`);
          }
        }

        if (limitToUse) {
          url += (url.includes("?") ? "&" : "?") + `limit=${limitToUse}`;
          if (import.meta.env.DEV) {
            console.debug(
              `[fetchPayments] Intento ${
                attemptNo + 1
              }: usando limit=${limitToUse}`
            );
          }
        }

        const response = await authFetch(url, {
          signal: controller.signal as AbortSignal,
        } as RequestInit);

        if (!response.ok) {
          if (response.status === 504) {
            if (attemptNo < 2) {
              // Reintentar con parámetros más conservadores
              const delay = attemptNo === 0 ? 1000 : 2000;
              await new Promise((r) => setTimeout(r, delay));
              return attempt(attemptNo + 1);
            } else {
              // Ya se agotaron los reintentos
              toastRef.current?.showToast(
                "El backend no responde después de varios intentos. Verifica tu conexión o contacta al administrador. Como alternativa temporal, puedes usar la función de búsqueda para cargar facturas específicas.",
                "error"
              );
              // Cargar lista vacía para que la UI funcione
              setPayments([]);
              return;
            }
          }
          throw new Error(
            `Error al obtener los pagos del backend (HTTP ${response.status})`
          );
        }

        const raw = await response.json();
        const { normalizeToPayments } = await import("./utils/mappers");
        const data: Payment[] = normalizeToPayments(raw);
        setPayments(data);

        // Mostrar advertencia si se cargó con límite reducido
        if (limitToUse && limitToUse < 100 && attemptNo > 0) {
          toastRef.current?.showToast(
            `Facturas cargadas con límite reducido (${limitToUse}) debido a problemas de timeout. Usa la función de búsqueda para encontrar facturas específicas.`,
            "info"
          );
        }
      } catch (error: unknown) {
        if (error instanceof UnauthorizedError) {
          logoutRef.current?.();
          toastRef.current?.showToast(
            "Sesión expirada. Por favor, inicia sesión de nuevo.",
            "error"
          );
        } else if (
          (error instanceof DOMException && error.name === "AbortError") ||
          (typeof error === "string" &&
            (error === "timeout" ||
              error === "external-abort" ||
              error === "unmount" ||
              error === "replaced"))
        ) {
          // Silenciar aborts aquí para evitar ruido si el usuario navega o cambia de vista.
          // Si quieres mostrarlo, descomenta el toast.
          // const reason = (error as any)?.message || "abort";
          // toastRef.current?.showToast("La solicitud fue cancelada (" + reason + ")", "error");
        } else {
          toastRef.current?.showToast(
            "No se pudieron cargar los pagos. Intenta de nuevo.",
            "error"
          );
          console.error(error);
        }
      } finally {
        // Limpia el ref solo si es el mismo controller (evita pisar uno nuevo)
        if (fetchAbortRef.current === controller) {
          fetchAbortRef.current = null;
        }
      }
    };
    await attempt(0);
  }, []);

  const handleImportExcel = async (file: File) => {
    // Validación básica del archivo
    const maxSizeMB = Number(import.meta.env.VITE_MAX_UPLOAD_MB || 15);
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const allowedExtensions = [".xlsx", ".xls"];

    console.log(
      `[handleImportExcel] Validando archivo: ${file.name}, tamaño: ${
        file.size
      }, tipo: ${file.type || "no especificado"}`
    );

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.showToast(
        `El archivo supera ${maxSizeMB}MB. Reduce el tamaño e intenta de nuevo.`,
        "error"
      );
      return;
    }

    // Validar extensión del archivo
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!allowedExtensions.includes(fileExtension)) {
      toast.showToast(
        `Extensión de archivo no válida (${fileExtension}). Solo se permiten archivos .xlsx y .xls`,
        "error"
      );
      return;
    }

    // Validar MIME type si está disponible
    if (file.type && !allowedTypes.includes(file.type)) {
      console.warn(
        `[handleImportExcel] MIME type inesperado: ${file.type}, pero extensión válida: ${fileExtension}`
      );
    }

    // Validar que el archivo no esté vacío
    if (file.size === 0) {
      toast.showToast(
        "El archivo está vacío. Selecciona un archivo válido.",
        "error"
      );
      return;
    }

    const uploadFieldName =
      (import.meta.env.VITE_UPLOAD_FIELD_NAME as string | undefined) || "file";
    const formData = new FormData();
    formData.append(uploadFieldName, file, file.name);
    // Log para mostrar el contenido del FormData
    for (const pair of formData.entries()) {
      console.log(`[handleImportExcel] FormData: ${pair[0]} =`, pair[1]);
    }
    console.log(
      `[handleImportExcel] Archivo: ${file.name}, Tamaño: ${
        file.size
      } bytes, Tipo: ${file.type || "no especificado"}`
    );
    setLoadingExcel(true);
    try {
      console.log(
        `[handleImportExcel] Intentando POST ${apiUrl(
          "/facturas/importar-excel"
        )} con campo '${uploadFieldName}'`
      );
      let response = await authFetch(apiUrl(`/facturas/importar-excel`), {
        method: "POST",
        body: formData,
      });
      if (response.status === 404) {
        console.log(
          `[handleImportExcel] 404 en /facturas/importar-excel, probando /excel/importar-excel`
        );
        const alt = await authFetch(apiUrl(`/excel/importar-excel`), {
          method: "POST",
          body: formData,
        });
        if (alt.ok) response = alt;
      }
      if (!response.ok) {
        let errorMsg = `Error al importar (HTTP ${response.status})`;
        try {
          const text = await response.text();
          if (text) {
            console.error("[handleImportExcel] Error body:", text);
            try {
              const json = JSON.parse(text);
              errorMsg = json.message || json.error || errorMsg;
              // Mostrar más detalles si están disponibles
              if (json.details) {
                console.error(
                  "[handleImportExcel] Detalles del error:",
                  json.details
                );
                errorMsg += ` - ${json.details}`;
              }
            } catch {
              // Si no es JSON, usar el texto tal como viene
              errorMsg =
                text.length > 200 ? `${text.substring(0, 200)}...` : text;
            }
          }
        } catch {
          // ignore
        }
        if (response.status === 500) {
          errorMsg = `Error interno del servidor (${response.status}): ${errorMsg}. Verifica que el archivo Excel tenga el formato correcto y las columnas esperadas por el backend.`;
        } else if (response.status === 504) {
          errorMsg +=
            " — Timeout en el gateway. Verifica que el backend procese el archivo dentro del timeout y aumenta VITE_UPLOAD_TIMEOUT_MS o el timeout del API Gateway.";
        }
        // Hint común si el backend espera otro nombre de campo
        if (response.status === 400) {
          errorMsg +=
            " — Verifica que el nombre del campo del archivo sea el esperado por el backend (actual: '" +
            uploadFieldName +
            "'). Puedes ajustar VITE_UPLOAD_FIELD_NAME si el backend usa otro (p.ej. 'excel' o 'archivo').";
        }
        toast.showToast(errorMsg, "error");
        return;
      }
      // Log de la respuesta del backend y mostrar mensaje si viene en texto
      let successMsg = "Archivo importado correctamente";
      try {
        const responseData = await response.json();
        console.log(
          "[handleImportExcel] Respuesta del backend (JSON):",
          responseData
        );
      } catch {
        try {
          const responseText = await response.text();
          if (responseText) successMsg = responseText;
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
      toast.showToast(successMsg, "success");
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
      let response = await authFetch(apiUrl(`/facturas/${facturaId}`), {
        method: "DELETE",
      });
      if (response.status === 404 || response.status === 405) {
        const alt = await authFetch(apiUrl(`/facturas/eliminar/${facturaId}`), {
          method: "DELETE",
        });
        if (alt.ok) response = alt;
      }
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
      toast.showToast("Factura eliminada correctamente", "success");
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
      let response = await authFetch(apiUrl(`/pagos/registrar-pago`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facturaId, valorPago, observaciones }),
      });
      if (response.status === 404) {
        const alt = await authFetch(apiUrl(`/pagos/registrar`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facturaId, valorPago, observaciones }),
        });
        if (alt.ok) response = alt;
      }
      if (!response.ok) {
        let errorMsg = `Error al registrar el pago (HTTP ${response.status})`;
        try {
          const text = await response.text();
          if (text) errorMsg = text; // el backend envía strings en 400/500
        } catch {
          // ignore
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

  // Cargar pagos al iniciar sesión (una sola vez por cambio de auth)
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) {
      didFetchRef.current = false;
      return;
    }
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchPayments();
    // Intencionalmente no dependemos de fetchPayments para evitar bucles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
            <Button
              variant="back"
              className="mt-4 underline"
              onClick={() => setShowRegister(false)}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </>
        ) : (
          <>
            <Suspense fallback={<Spinner label="Cargando login..." />}>
              <LoginForm onSuccess={() => setIsAuthenticated(true)} />
            </Suspense>
            <Button
              variant="back"
              className="mt-4 underline"
              onClick={() => setShowRegister(true)}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </>
        )}
        {userRole === "GERENTE" && (
          <Button
            variant="back"
            onClick={() => setActiveView("dashboard")}
            className={`${
              activeView === "dashboard"
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200`}
          >
            {activeView === "dashboard"
              ? "Ocultar Dashboard"
              : "Dashboard Financiero"}
          </Button>
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
      <ApiDebugOverlay />
      {/* Barra superior con rol */}
      <div className="w-full flex justify-end items-center px-6 pt-4">
        {isAuthenticated && (
          <span className="text-xs md:text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded px-3 py-1 shadow-sm">
            Rol: <b>{roleLabel}</b>
          </span>
        )}
      </div>
      {(userRole === "GERENTE" || userRole === "VENDEDOR") && (
        <Suspense fallback={<Spinner label="Cargando alertas..." />}>
          <AlertsVencimiento />
        </Suspense>
      )}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-5">
        Sistema de Pagos
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <Button
          variant="back"
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
        </Button>
        <Button
          variant="back"
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
        </Button>
        {/* Mostrar el botón de importar Excel para todos los roles */}
        {userRole === "GERENTE" && (
          <Suspense fallback={<Spinner label="Cargando importador..." />}>
            <ExcelUpload onImport={handleImportExcel} loading={loadingExcel} />
          </Suspense>
        )}
        <Button
          variant="back"
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
        </Button>
        <Button
          variant="back"
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
        </Button>
        <Button
          variant="back"
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
        </Button>
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
        ) : activeView === "facturasVencidas" &&
          (userRole === "GERENTE" || userRole === "VENDEDOR") ? (
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
      <Button
        variant="back"
        onClick={logout}
        className="mt-4 font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
      >
        Cerrar sesión
      </Button>
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
