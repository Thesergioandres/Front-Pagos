export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("cognito_token");
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(input, { ...init, headers });
}
