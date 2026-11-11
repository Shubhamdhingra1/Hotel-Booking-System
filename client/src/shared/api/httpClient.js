import axios from "axios";
import { baseURL } from "../../baseURL/baseURL";
import { getAccessToken } from "../auth/tokenStorage";

/** Shared HTTP client; sends JWT only via Authorization: Bearer header. */
export const httpClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Strips full API origin so paths work with httpClient. */
export function toApiPath(urlOrPath) {
  if (!urlOrPath) return "/";
  if (urlOrPath.startsWith(baseURL)) {
    return urlOrPath.slice(baseURL.length) || "/";
  }
  return urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
}
