export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("cognito_token");
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // Log para depuración
  console.log("[authFetch] Token:", token);
  console.log("[authFetch] Authorization header:", headers.Authorization);
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  return response;
}
