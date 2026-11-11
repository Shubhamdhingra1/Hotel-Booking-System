export function getAccessToken() {
  const token = localStorage.getItem("access_token");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

export function setAccessToken(token) {
  localStorage.setItem("access_token", token);
}

export function clearAccessToken() {
  localStorage.removeItem("access_token");
}
