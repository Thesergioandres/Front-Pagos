import React, { useState } from "react";
import { loginUser } from "../../utils/cognitoRegister";
import { useToast } from "../../context/use-toast";

interface Props {
  onSuccess?: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de entorno en desarrollo para evitar 400 de Cognito por config incompleta
    const env: any = (import.meta as any).env || {};
    if (env.DEV) {
      const missing: string[] = [];
      if (!env.VITE_COGNITO_REGION) missing.push("VITE_COGNITO_REGION");
      if (!env.VITE_USER_POOL_ID) missing.push("VITE_USER_POOL_ID");
      if (!env.VITE_COGNITO_CLIENT_ID) missing.push("VITE_COGNITO_CLIENT_ID");
      if (missing.length > 0) {
        toast.showToast(
          `Faltan variables de Cognito: ${missing.join(
            ", "
          )}. Configúralas en .env.development o variables del entorno antes de iniciar sesión.`,
          "error"
        );
        return;
      }
    }
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.showToast("¡Inicio de sesión exitoso!", "success");
      setEmail("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.showToast(error.message || "Error al iniciar sesión", "error");
      } else {
        toast.showToast("Error al iniciar sesión", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};

export default LoginForm;
