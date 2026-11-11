/** Returns stored JWT or null if missing / cleared. */
export function getAccessToken() {
  const token = localStorage.getItem("access_token");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

/** Persists JWT after login or registration. */
export function setAccessToken(token) {
  localStorage.setItem("access_token", token);
}

/** Clears session token on logout. */
export function clearAccessToken() {
  localStorage.removeItem("access_token");
}
