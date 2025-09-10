import React, { useState } from "react";
import { useToast } from "../../context/use-toast";
import { registerUser } from "../../utils/cognitoRegister";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface Props {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
          `Faltan variables de Cognito: ${missing.join(
            ", "
          )}. Configúralas en .env.development o variables del entorno antes de registrarte.`,
          "error"
        );
        return;
      }
    }
    setLoading(true);
    try {
      await registerUser(email, password, name);
      toast.showToast(
        "¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.",
        "success"
      );
      setEmail("");
      setName("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      let msg = err.message || "Error en el registro";
      if (err.code === "InvalidPasswordException") {
        msg = "La contraseña no cumple la política del pool.";
      } else if (err.code === "UsernameExistsException") {
        msg = "El usuario ya existe. Intenta iniciar sesión.";
      }
      toast.showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Registro</h2>
      <Input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
        isLoading={loading}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </Button>
      {import.meta.env.DEV && (
        <p className="text-[11px] text-gray-500 text-center">
          Requiere VITE_USER_POOL_ID y VITE_COGNITO_CLIENT_ID en
          .env.development
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
