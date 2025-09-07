import * as React from "react";
import { getUserRole } from "../utils/getUserRole";
import { AuthContext } from "./auth-context-base";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      setUserRole(getUserRole());
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("cognito_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
