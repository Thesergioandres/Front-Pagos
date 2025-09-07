import * as React from "react";
import { ToastContext } from "./toast-context-base";

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context)
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  return context;
};
