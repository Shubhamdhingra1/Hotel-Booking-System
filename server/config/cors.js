const LOCAL_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

/** Comma-separated extra origins in CORS_ORIGINS (e.g. deployed client URLs). */
export function getAllowedCorsOrigins() {
    const fromEnv = (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return [...new Set([...LOCAL_ORIGINS, ...fromEnv])];
}

export function buildCorsOptions() {
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
