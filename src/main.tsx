import { Buffer } from "buffer";
import process from "process";

// Extiende la interfaz Window para incluir 'process'
declare global {
  interface Window {
    process: typeof process;
    Buffer: typeof Buffer;
  }
}

// Polyfill globales antes de cualquier otro import
window.Buffer = Buffer;
window.process = process;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Comprobación de entorno solo en desarrollo
const __env = import.meta.env as {
  DEV: boolean;
  VITE_API_BASE?: string;
  VITE_COGNITO_REGION?: string;
  VITE_USER_POOL_ID?: string;
  VITE_COGNITO_CLIENT_ID?: string;
};
if (__env.DEV) {
  const apiBase = __env.VITE_API_BASE;
  const cognitoRegion = __env.VITE_COGNITO_REGION;
  const userPoolId = __env.VITE_USER_POOL_ID;
  const clientId = __env.VITE_COGNITO_CLIENT_ID;
  // Mostrar valores clave (enmascarados donde aplica)
  console.info("[ENV] VITE_API_BASE:", apiBase);
  console.info("[ENV] Cognito:", {
    region: cognitoRegion,
    userPoolId: userPoolId ? `${userPoolId.slice(0, 6)}…` : undefined,
    clientId: clientId ? `${clientId.slice(0, 6)}…` : undefined,
  });
}

// Verificación silenciosa en producción: validar presencia de variables clave
if (!__env.DEV) {
  const missing: string[] = [];
  if (!__env.VITE_API_BASE) missing.push("VITE_API_BASE");
  if (!__env.VITE_COGNITO_REGION) missing.push("VITE_COGNITO_REGION");
  if (!__env.VITE_USER_POOL_ID) missing.push("VITE_USER_POOL_ID");
  if (!__env.VITE_COGNITO_CLIENT_ID) missing.push("VITE_COGNITO_CLIENT_ID");
  if (missing.length > 0) {
    console.error(
      "[ENV][prod] Faltan variables de entorno requeridas:",
      missing.join(", ")
    );
  } else {
    const apiBase = __env.VITE_API_BASE;
    const userPoolId = __env.VITE_USER_POOL_ID;
    const clientId = __env.VITE_COGNITO_CLIENT_ID;
    console.info("[ENV][prod] Variables de entorno presentes:", {
      apiBase: apiBase ? `${apiBase.slice(0, 24)}…` : undefined,
      region: __env.VITE_COGNITO_REGION,
      userPoolId: userPoolId ? `${userPoolId.slice(0, 6)}…` : undefined,
      clientId: clientId ? `${clientId.slice(0, 6)}…` : undefined,
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
