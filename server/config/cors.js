const LOCAL_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

/** Comma-separated origins when not using open CORS. */
export function getAllowedCorsOrigins() {
    const fromEnv = (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return [...new Set([...LOCAL_ORIGINS, ...fromEnv])];
}

function useOpenCors() {
    const flag = process.env.CORS_ALLOW_ALL?.trim().toLowerCase();
    if (flag === "true" || flag === "1") return true;
    if (process.env.CORS_ORIGINS?.trim() === "*") return true;
    return false;
}

export function buildCorsOptions() {
    if (useOpenCors()) {
        return {
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200,
        };
    }

    const allowedOrigins = getAllowedCorsOrigins();

    return {
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(null, false);
        },
        credentials: true,
        optionsSuccessStatus: 200,
    };
}
