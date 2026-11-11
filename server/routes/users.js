import Express from "express";
import {
    deleteUser,
    getCurrentMonthNewUserCount,
    getTotalUserCount,
    getUser,
    getUsers,
    updateUser,
} from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../utils/verification.js";

const router = Express.Router();

router.get("/metrics/totalusers", verifyAdmin, getTotalUserCount);
router.get("/metrics/newusers", verifyAdmin, getCurrentMonthNewUserCount);

router.get("/profile/:id", verifyUser, getUser);
router.patch("/profile/:id", verifyUser, updateUser);
router.delete("/profile/:id", verifyUser, deleteUser);

router.get("/", verifyAdmin, getUsers);

export default router;
