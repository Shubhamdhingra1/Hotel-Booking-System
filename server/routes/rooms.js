import Express from "express";
import {
    createRoom,
    deleteRoom,
    getAllRooms,
    getBookingCount,
    getRoom,
    updateRoom,
    updateRoomAvailability,
} from "../controllers/room.js";
import { verifyAdmin, verifyAuthenticated } from "../utils/verification.js";

const router = Express.Router();

router.get("/metrics/bookings", verifyAdmin, getBookingCount);

router.post("/hotel/:hotelId", verifyAdmin, createRoom);
router.patch("/:id", verifyAdmin, updateRoom);
router.delete("/hotel/:hotelId/id/:id", verifyAdmin, deleteRoom);
router.patch("/availability/:roomId", verifyAuthenticated, updateRoomAvailability);

router.get("/", getAllRooms);
router.get("/rooms/:hotelId/:id", getRoom);

export default router;
