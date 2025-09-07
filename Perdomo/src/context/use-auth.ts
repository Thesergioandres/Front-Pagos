import * as React from "react";
import { AuthContext } from "./auth-context-base";

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
