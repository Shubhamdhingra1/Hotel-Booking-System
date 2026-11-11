import { httpClient } from "../api/httpClient";
import { setAccessToken } from "./tokenStorage";

export async function completeAuthSession(dispatch, accessToken, userId) {
  setAccessToken(accessToken);
  const { data } = await httpClient.get(`/user/profile/${userId}`);
  dispatch({ type: "LOGIN_SUCCESS", payload: data });
  return data;
}
