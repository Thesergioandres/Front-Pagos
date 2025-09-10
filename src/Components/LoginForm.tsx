import React, { useState } from "react";
import Button from "./ui/Button";
import { loginUser } from "../utils/cognitoRegister";
import { useToast } from "../context/use-toast";

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
        className="w-full border rounded px-3 py-2 bg-black text-white border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 bg-black text-white border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
        required
      />
      <Button
        type="submit"
        variant="back"
        className="w-full"
        disabled={loading}
        isLoading={loading}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
};

export default LoginForm;
