/**
 * Reads JWT from Authorization: Bearer header only.
 */
export function extractAccessToken(req) {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        return header.slice(7).trim();
    }
    return null;
}
