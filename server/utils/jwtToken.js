import { SignJWT, jwtVerify } from "jose";

function getSecretKey() {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("JWT_SECRET_KEY is not configured");
    }
    return new TextEncoder().encode(secret);
}

export async function signAccessToken({ id, isAdmin }) {
    return new SignJWT({ id: String(id), isAdmin: Boolean(isAdmin) })
        .setProtectedHeader({ alg: "HS256" })
        .sign(getSecretKey());
}

export async function verifyAccessToken(token) {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
}
