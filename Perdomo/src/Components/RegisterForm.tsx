import React, { useState } from "react";
import { registerUser } from "../utils/cognitoRegister";

interface Props {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(email, password, name);
      alert("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      setEmail("");
      setName("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error en el registro");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Registro</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
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
        className="w-full bg-blue-600 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
};

export default RegisterForm;
