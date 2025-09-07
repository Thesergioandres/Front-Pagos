import { useMemo } from "react";

type ToastType = "info" | "success" | "error";

export function useToast() {
  // Implementación mínima: usa console como placeholder
  return useMemo(
    () => ({
      showToast: (message: string, type: ToastType = "info") => {
        const tag = type.toUpperCase();
        console[type === "error" ? "error" : type === "success" ? "log" : "info"](
          `[TOAST][${tag}] ${message}`
        );
      },
    }),
    []
  );
}
