import * as React from "react";
import { ToastContext, type Toast } from "./toast-context-base";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = React.useState<Toast | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-white text-sm font-semibold transition-all
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
