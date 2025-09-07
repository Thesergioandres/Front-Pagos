import React, { useState } from "react";
import { loginUser } from "../../utils/cognitoRegister";
import { useToast } from "../../context/use-toast";

interface Props {
  onSuccess?: () => void;
}

// Tipo mínimo para errores de Cognito
interface CognitoErrorLike {
  code?: string;
  message?: string;
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de entorno en desarrollo para evitar 400 de Cognito por config incompleta
    const env = import.meta.env as {
      DEV: boolean;
      VITE_COGNITO_REGION?: string;
      VITE_USER_POOL_ID?: string;
      VITE_COGNITO_CLIENT_ID?: string;
    };
    if (env.DEV) {
      const missing: string[] = [];
      if (!env.VITE_COGNITO_REGION) missing.push("VITE_COGNITO_REGION");
      if (!env.VITE_USER_POOL_ID) missing.push("VITE_USER_POOL_ID");
      if (!env.VITE_COGNITO_CLIENT_ID) missing.push("VITE_COGNITO_CLIENT_ID");
      if (missing.length > 0) {
        toast.showToast(
          `Faltan variables de Cognito: ${missing.join(", ")}. Configúralas en .env.development o variables del entorno antes de iniciar sesión.`,
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
      const err = error as CognitoErrorLike;
      const code = err.code;
      const message = err.message;
      let friendly = message || "Error al iniciar sesión";
      if (code === "UserNotConfirmedException") {
        friendly = "Tu correo no está confirmado. Revisa tu email y confirma la cuenta.";
      } else if (code === "NotAuthorizedException") {
        friendly = "Credenciales inválidas. Verifica tu correo y contraseña.";
      } else if (code === "UserNotFoundException") {
        friendly = "Usuario no encontrado. Regístrate antes de iniciar sesión.";
      }
      toast.showToast(friendly, "error");
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
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 pr-12"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 underline"
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>
      {import.meta.env.DEV && (
        <p className="text-[11px] text-gray-500 text-center">
          Usa VITE_USER_POOL_ID y VITE_COGNITO_CLIENT_ID en .env.development
        </p>
      )}
    </form>
  );
};

export default LoginForm;
