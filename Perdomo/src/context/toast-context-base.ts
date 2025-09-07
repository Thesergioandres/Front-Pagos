import * as React from "react";

export interface Toast {
  message: string;
  type?: "success" | "error" | "info";
}

export interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);
