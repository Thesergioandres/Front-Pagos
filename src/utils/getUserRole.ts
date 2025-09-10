export function getUserRole(): string | null {
  // Preferir id token (contiene cognito:groups), mantener compatibilidad con clave vieja
  const token =
    localStorage.getItem("cognito_id_token") ||
    localStorage.getItem("cognito_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Cognito guarda los grupos (roles) en 'cognito:groups' como array
    if (payload["cognito:groups"] && payload["cognito:groups"].length > 0) {
      return payload["cognito:groups"][0]; // Si hay varios, toma el primero
    }
    return null;
  } catch {
    return null;
  }
}
