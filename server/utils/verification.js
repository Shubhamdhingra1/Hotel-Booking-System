import { createError } from "./createError.js";
import { extractAccessToken } from "../middleware/extractToken.js";
import { verifyAccessToken } from "./jwtToken.js";

/** Authenticates request using JWT from Authorization: Bearer header only. */
export const verifyToken = async (req, res, next) => {
    const token = extractAccessToken(req);

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Missing Authorization: Bearer <token> header",
        });
    }

    try {
        req.user = await verifyAccessToken(token);
        next();
    } catch {
        next(createError(403, "Token is not valid"));
    }
};

/** Ensures the logged-in user matches :id in the route (or is admin). */
export const verifyUser = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        const routeUserId = req.params.id;
        if (String(req.user.id) === String(routeUserId) || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "Unauthorized"));
        }
    });
};

/** Same as verifyUser but only checks JWT (for routes without :id). */
export const verifyAuthenticated = verifyToken;

export const verifyAdmin = async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "Unauthorized"));
        }
    });
};
