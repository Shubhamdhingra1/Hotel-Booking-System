const fromEnv = process.env.REACT_APP_API_BASE_URL?.trim();

if (!fromEnv) {
  throw new Error(
    "REACT_APP_API_BASE_URL is missing. Set it in client/.env (see client/.env.example)."
  );
}

export const baseURL = fromEnv.replace(/\/$/, "");
