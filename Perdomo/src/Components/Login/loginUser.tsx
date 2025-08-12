import React, { useState } from "react";
import { loginUser } from "../../utils/cognitoLogin";

const LoginUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      setResult("¡Inicio de sesión exitoso!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(error.message);
      } else {
        setResult("Error al iniciar sesión");
      }
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <input
        className="w-full mb-3 p-2 border rounded"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Iniciar Sesión
      </button>
      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">{result}</div>
      )}
    </form>
  );
};

export default LoginUser;
