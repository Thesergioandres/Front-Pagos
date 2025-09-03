import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

// Usa tus datos reales de pool
const poolData = {
  UserPoolId: "us-east-2_t4jRmSWcA",
  ClientId: "3gqfebf7v0sudqp0mds14ategj",
};
const userPool = new CognitoUserPool(poolData);

export function registerUser(email: string, password: string, name: string) {
  return new Promise((resolve, reject) => {
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
    Pool: userPool,
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
        localStorage.setItem("cognito_token", idToken);
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
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
