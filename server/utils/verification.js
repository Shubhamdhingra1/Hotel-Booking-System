import jwt from "jsonwebtoken";
import { createError } from "./createError.js";
import { extractAccessToken } from "../middleware/extractToken.js";

/** Authenticates request using JWT from Authorization: Bearer header only. */
export const verifyToken = (req, res, next) => {
    const token = extractAccessToken(req);

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Missing Authorization: Bearer <token> header",
        });
    }


    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("decodedToken : ", decodedToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        next(createError(403, "Token is not valid"));
    }

}

/** Ensures the logged-in user matches :id in the route (or is admin). */
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
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

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // console.log("req from verifyAdmin :::: ", req.user);
        // console.log('verifyAdmin')
        if (req.user.isAdmin) {
            // console.log('working');
            next();
        } else {
            return next(createError(403, "Unauthorized"));
        }
    });
};