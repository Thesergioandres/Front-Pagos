import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

type Props = {
  confirmForm: { Username: string; ConfirmationCode: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ConfirmEmailForm: React.FC<Props> = ({
  confirmForm,
  onChange,
  onSubmit,
}) => (
  <form
    className="max-w-md mx-auto bg-white p-6 rounded shadow"
    onSubmit={onSubmit}
  >
    <h2 className="text-2xl font-bold mb-4">Confirmar Correo</h2>
    <div className="mb-3">
      <label className="block text-gray-700 text-sm mb-1">
        Correo electrónico:
      </label>
      <Input
        type="email"
        name="Username"
        value={confirmForm.Username}
        disabled
        readOnly
      />
    </div>
    <Input
      className="mb-3"
      type="text"
      name="ConfirmationCode"
      placeholder="Código de confirmación"
      value={confirmForm.ConfirmationCode}
      onChange={onChange}
      required
    />
    <Button className="w-full" type="submit">
      Confirmar
    </Button>
  </form>
);

export default ConfirmEmailForm;
