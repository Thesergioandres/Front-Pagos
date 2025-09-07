import React from "react";

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
      <input
        className="w-full p-2 border rounded bg-gray-100"
        type="email"
        name="Username"
        value={confirmForm.Username}
        disabled
        readOnly
      />
    </div>
    <input
      className="w-full mb-3 p-2 border rounded"
      type="text"
      name="ConfirmationCode"
      placeholder="Código de confirmación"
      value={confirmForm.ConfirmationCode}
      onChange={onChange}
      required
    />
    <button
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      type="submit"
    >
      Confirmar
    </button>
  </form>
);

export default ConfirmEmailForm;
