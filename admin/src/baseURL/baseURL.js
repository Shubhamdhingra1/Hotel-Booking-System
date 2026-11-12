const fromEnv = process.env.REACT_APP_API_BASE_URL?.trim();

if (!fromEnv) {
  throw new Error(
    "REACT_APP_API_BASE_URL is missing. Set it in admin/.env (see admin/.env.example)."
  );
}

export const baseURL = fromEnv.replace(/\/$/, "");
