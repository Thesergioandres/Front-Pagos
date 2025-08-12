import React, { useState } from "react";
import { loginUser } from "../utils/cognitoRegister";

interface Props {
  onSuccess?: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      alert("¡Inicio de sesión exitoso!");
      setEmail("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Error al iniciar sesión");
      } else {
        alert("Error al iniciar sesión");
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
