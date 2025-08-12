import React from "react";

type Props = {
  form: { Username: string; Password: string; Name: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const RegisterForm: React.FC<Props> = ({ form, onChange, onSubmit }) => (
  <form
    className="max-w-md mx-auto bg-white p-6 rounded shadow"
    onSubmit={onSubmit}
  >
    <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
    <input
      className="w-full mb-3 p-2 border rounded"
      type="email"
      name="Username"
      placeholder="Correo electrónico"
      value={form.Username}
      onChange={onChange}
      required
    />
    <input
      className="w-full mb-3 p-2 border rounded"
      type="password"
      name="Password"
      placeholder="Contraseña"
      value={form.Password}
      onChange={onChange}
      required
    />
    <input
      className="w-full mb-3 p-2 border rounded"
      type="text"
      name="Name"
      placeholder="Nombre"
      value={form.Name}
      onChange={onChange}
      required
    />
    <button
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      type="submit"
    >
      Registrar
    </button>
  </form>
);

export default RegisterForm;