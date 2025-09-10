import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_t4jRmSWcA",
  ClientId: "3gqfebf7v0sudqp0mds14ategj",
};
const userPool = new CognitoUserPool(poolData);

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
        const accessToken = result.getAccessToken().getJwtToken();
        localStorage.setItem("cognito_token", idToken);
        localStorage.setItem("cognito_id_token", idToken);
        localStorage.setItem("cognito_access_token", accessToken);
        localStorage.setItem("AUTH_TOKEN_TYPE", "id");
        resolve(result);
      },
      onFailure: (err) => reject(err),
    });
  });
}
