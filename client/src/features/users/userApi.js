import { httpClient } from "../../shared/api/httpClient";

/** Loads a user profile when the caller owns that account (Bearer auth). */
export function fetchUserProfile(userId) {
  return httpClient.get(`/user/profile/${userId}`);
}

/** Updates profile fields for the authenticated user. */
export function updateUserProfile(userId, payload) {
  return httpClient.patch(`/user/profile/${userId}`, payload);
}

/** Email/password login. */
export function loginWithCredentials(credentials) {
  return httpClient.post("/auth/login", credentials);
}

/** Registers a new account. */
export function registerAccount(payload) {
  return httpClient.post("/auth/register", payload);
}
