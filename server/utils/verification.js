import jwt from "jsonwebtoken";
import { createError } from "./createError.js";

export const verifyToken = (req, res, next) => {
    // console.log("verifyToken : ",req);
    const token = req.params.access_token;

    if (!token)
        return res.status(401).json({ error: "Unauthorized" });


    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("decodedToken : ", decodedToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        next(createError(403, "Token is not valid"));
    }

}

export const verifyUser = (req, res, next) => {
    // console.log("from verifyUser : ", req.user);
    verifyToken(req, res, () => {
        // console.log("req from verifyUesr :::: ",req.user);
        // console.log('verifyUesr')
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "Unauthorized"));
        }
    });
};

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