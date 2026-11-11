import express from "express";
import { bookService } from "../controllers/travel/bookingController.js";
import { verifyToken } from "../utils/verification.js";

const router = express.Router();

router.post("/", verifyToken, bookService);

export default router;
