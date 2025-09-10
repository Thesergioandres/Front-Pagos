import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

// Inicializa el pool desde variables de entorno de Vite
function getUserPool() {
  const env = import.meta.env as {
    VITE_USER_POOL_ID?: string;
    VITE_COGNITO_CLIENT_ID?: string;
  };
  const UserPoolId = env.VITE_USER_POOL_ID;
  const ClientId = env.VITE_COGNITO_CLIENT_ID;
  if (!UserPoolId || !ClientId) {
    throw new Error(
      "Configuración de Cognito incompleta: define VITE_USER_POOL_ID y VITE_COGNITO_CLIENT_ID"
    );
  }
  return new CognitoUserPool({ UserPoolId, ClientId });
}

export function registerUser(email: string, password: string, name: string) {
  return new Promise((resolve, reject) => {
    const userPool = getUserPool();
    userPool.signUp(
      email,
      password,
      [new CognitoUserAttribute({ Name: "name", Value: name })],
      [],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

export function loginUser(email: string, password: string) {
  const userData = {
    Username: email,
    Pool: getUserPool(),
  };
  const cognitoUser = new CognitoUser(userData);
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        // Guardar ambos: access para llamadas a API, id para roles (grupos)
        localStorage.setItem("cognito_access_token", accessToken);
        localStorage.setItem("cognito_id_token", idToken);
        // Compatibilidad: conservar cognito_token como idToken (usado por getUserRole antiguo)
        localStorage.setItem("cognito_token", idToken);
        // Preferencia: usar id token por defecto para evitar 401 si el backend valida id
        localStorage.setItem("AUTH_TOKEN_TYPE", "id");
        resolve(result);
      },
      onFailure: (err) => reject(err),
    });
  });
}

export function confirmUser(email: string, code: string) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: getUserPool(),
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
