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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
