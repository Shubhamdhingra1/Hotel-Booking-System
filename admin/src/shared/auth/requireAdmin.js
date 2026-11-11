import { clearAccessToken } from "./tokenStorage";

/** After profile load, ensure this user may use the admin app. */
export function requireAdminProfile(dispatch, profile) {
  if (profile?.isAdmin) return true;
  clearAccessToken();
  dispatch({ type: "LOGOUT" });
  dispatch({
    type: "LOGIN_FAILURE",
    payload: {
      message:
        "This account is not an admin. Log in with an admin user (isAdmin: true in MongoDB).",
    },
  });
  return false;
}
