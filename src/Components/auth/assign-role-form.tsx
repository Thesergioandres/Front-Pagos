import React from "react";

const ROLES = ["DISTRIBUIDOR", "GERENTE", "VENDEDOR"];
const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID;

type Props = {
  roleForm: { Username: string; GroupName: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const AssignRoleForm: React.FC<Props> = ({ roleForm, onChange, onSubmit }) => (
  <form
    className="max-w-md mx-auto bg-white p-6 rounded shadow"
    onSubmit={onSubmit}
  >
    <h2 className="text-2xl font-bold mb-4">Asignar Rol a Usuario</h2>
    <input
      className="w-full mb-3 p-2 border rounded"
      type="text"
      name="Username"
      placeholder="Correo electrónico del usuario"
      value={roleForm.Username}
      onChange={onChange}
      required
    />
    <select
      className="w-full mb-3 p-2 border rounded"
      name="GroupName"
      value={roleForm.GroupName}
      onChange={onChange}
      required
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
    <input
      className="w-full mb-3 p-2 border rounded bg-gray-100"
      type="text"
      name="UserPoolId"
      value={USER_POOL_ID}
      disabled
      readOnly
    />
    <button
      className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      type="submit"
    >
      Asignar Rol
    </button>
    <p className="text-xs text-gray-500 mt-2">
      * Esta acción requiere ejecutarse desde un backend seguro.
    </p>
  </form>
);

export default AssignRoleForm;
