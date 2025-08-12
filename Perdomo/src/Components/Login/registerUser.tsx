import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import ConfirmEmailForm from "./ConfirmEmailForm";
import AssignRoleForm from "./AssignRoleForm";

const ROLES = ["DISTRIBUIDOR", "GERENTE", "VENDEDOR"];
const USER_POOL_ID = "us-east-2_t4jRmSWcA";

type RegisterFormType = {
  Username: string;
  Password: string;
  Name: string;
};

type ConfirmFormType = {
  Username: string;
  ConfirmationCode: string;
};

type RoleFormType = {
  Username: string;
  GroupName: string;
};

const RegisterUser = () => {
  const [form, setForm] = useState<RegisterFormType>({
    Username: "",
    Password: "",
    Name: "",
  });

  const [confirmForm, setConfirmForm] = useState<ConfirmFormType>({
    Username: "",
    ConfirmationCode: "",
  });

  const [roleForm, setRoleForm] = useState<RoleFormType>({
    Username: "",
    GroupName: ROLES[0],
  });

  const [showConfirm, setShowConfirm] = useState(false);

  // Registro de usuario
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ClientId: "3gqfebf7v0sudqp0mds14ategj",
      Username: form.Username,
      Password: form.Password,
      UserAttributes: [
        {
          Name: "name",
          Value: form.Name,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://cognito-idp.us-east-2.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        alert(
          "Usuario registrado correctamente. Revisa tu correo para el código de confirmación."
        );
        setConfirmForm({ Username: form.Username, ConfirmationCode: "" });
        setShowConfirm(true);
      } else {
        const errorData = await response.json();
        alert(
          "Error al registrar usuario: " +
            (errorData.message || "Error desconocido")
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  // Confirmación de correo electrónico
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ClientId: "3gqfebf7v0sudqp0mds14ategj",
      Username: confirmForm.Username,
      ConfirmationCode: confirmForm.ConfirmationCode,
    };

    try {
      const response = await fetch(
        "https://cognito-idp.us-east-2.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        alert("Correo confirmado correctamente");
        setShowConfirm(false);
        setRoleForm({ Username: confirmForm.Username, GroupName: ROLES[0] });
      } else {
        const errorData = await response.json();
        alert(
          "Error al confirmar correo: " +
            (errorData.message || "Error desconocido")
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  // Agregar rol a usuario (requiere backend seguro)
  const handleAddRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      GroupName: roleForm.GroupName,
      UserPoolId: USER_POOL_ID,
      Username: roleForm.Username,
    };

    try {
      const response = await fetch(
        "https://cognito-idp.us-east-2.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target":
              "AWSCognitoIdentityProviderService.AdminAddUserToGroup",
            // Los siguientes headers deben ser generados por un backend seguro:
            // "X-Amz-Content-Sha256": "...",
            // "X-Amz-Date": "...",
            // "Authorization": "...",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        alert("Rol agregado correctamente");
      } else {
        const errorData = await response.json();
        alert(
          "Error al agregar rol: " + (errorData.message || "Error desconocido")
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  return (
    <div className="space-y-8">
      {!showConfirm && (
        <RegisterForm
          form={form}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          onSubmit={handleRegister}
        />
      )}

      {showConfirm && (
        <ConfirmEmailForm
          confirmForm={confirmForm}
          onChange={(e) =>
            setConfirmForm({ ...confirmForm, [e.target.name]: e.target.value })
          }
          onSubmit={handleConfirm}
        />
      )}

      {!showConfirm && (
        <AssignRoleForm
          roleForm={roleForm}
          onChange={(e) =>
            setRoleForm({ ...roleForm, [e.target.name]: e.target.value })
          }
          onSubmit={handleAddRole}
        />
      )}
    </div>
  );
};

export default RegisterUser;
