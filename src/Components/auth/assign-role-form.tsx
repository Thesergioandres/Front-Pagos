import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";

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
    <Input
      className="mb-3"
      type="text"
      name="Username"
      placeholder="Correo electrónico del usuario"
      value={roleForm.Username}
      onChange={onChange}
      required
    />
    <Select
      className="mb-3"
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
    </Select>
    <Input
      className="mb-3 bg-gray-100"
      type="text"
      name="UserPoolId"
      value={USER_POOL_ID}
      disabled
      readOnly
    />
    <Button className="w-full" type="submit">
      Asignar Rol
    </Button>
    <p className="text-xs text-gray-500 mt-2">
      * Esta acción requiere ejecutarse desde un backend seguro.
    </p>
  </form>
);

export default AssignRoleForm;
