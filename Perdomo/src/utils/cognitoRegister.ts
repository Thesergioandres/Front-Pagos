import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

type Env = {
  VITE_COGNITO_REGION?: string;
  VITE_USER_POOL_ID?: string;
  VITE_COGNITO_CLIENT_ID?: string;
};

function getEnv(): Env {
  // import.meta.env en Vite
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env: any = (import.meta as any).env || {};
  return env as Env;
}

function getPool() {
  const env = getEnv();
  const userPoolId = env.VITE_USER_POOL_ID;
  const clientId = env.VITE_COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    throw new Error(
      "Cognito no configurado: faltan VITE_USER_POOL_ID o VITE_COGNITO_CLIENT_ID"
    );
  }
  return new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<void> {
  const pool = getPool();
  const attributes: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: "name", Value: name }),
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];
  await new Promise<void>((resolve, reject) => {
    pool.signUp(email, password, attributes, [], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function loginUser(email: string, password: string): Promise<void> {
  const pool = getPool();
  const user = new CognitoUser({ Username: email, Pool: pool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });
  await new Promise<void>((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        try {
          const idToken = session.getIdToken()?.getJwtToken();
          if (idToken) {
            localStorage.setItem("cognito_token", idToken);
          }
        } catch {}
        resolve();
      },
      onFailure: (err) => reject(err),
    });
  });
}
export async function confirmUser(email: string, code: string): Promise<void> {
  const pool = getPool();
  const user = new CognitoUser({ Username: email, Pool: pool });
  await new Promise<void>((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
