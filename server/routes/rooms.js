import Express from "express";
import { createRoom, deleteRoom, getAllRooms, getBookingCount, getRoom, updateRoom, updateRoomAvailability } from "../controllers/room.js";
import { verifyAdmin, verifyUser } from "../utils/verification.js";
const router = Express.Router();



// CREATE 
router.post('/token/:access_token/:hotelId', verifyAdmin, createRoom);

// READ All
router.get('/', getAllRooms);

// READ One by Id
router.get('/rooms/:hotelId/:id', getRoom);

// UPDATE Room
router.patch('/token/:access_token/:id', verifyAdmin, updateRoom);

// UPDATE Room Availability
router.patch('/availability/token/:access_token/:id/:roomId', verifyUser,updateRoomAvailability);

// DELETE
router.delete('/token/:access_token/:hotelId/:id', verifyAdmin, deleteRoom);







router.get('/bookings/token/:access_token', verifyAdmin, getBookingCount);










export default router;