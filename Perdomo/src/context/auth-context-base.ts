import * as React from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);
