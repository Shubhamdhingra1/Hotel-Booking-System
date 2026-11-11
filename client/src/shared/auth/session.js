import { fetchUserProfile } from "../../features/users/userApi";
import { setAccessToken } from "./tokenStorage";

/** Stores JWT and loads user into auth context after login/register. */
export async function completeAuthSession(dispatch, accessToken, userId) {
  setAccessToken(accessToken);
  const { data } = await fetchUserProfile(userId);
  dispatch({ type: "LOGIN_SUCCESS", payload: data });
  return data;
}
