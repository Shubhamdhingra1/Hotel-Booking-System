import express from "express";
import {
    createHotel,
    deleteHotel,
    getAllCities,
    getAllCityHotelCount,
    getCurrentMonthNewHotelCount,
    getHotel,
    getHotelCountByCity,
    getHotelCountByType,
    getHotelRooms,
    getHotels,
    getTotalHotelCount,
    updateHotel,
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verification.js";

const router = express.Router();

router.get("/metrics/totalHotels", verifyAdmin, getTotalHotelCount);
router.get("/metrics/newHotels", verifyAdmin, getCurrentMonthNewHotelCount);

router.post("/", verifyAdmin, createHotel);
router.patch("/id/:id", verifyAdmin, updateHotel);
router.delete("/id/:id", verifyAdmin, deleteHotel);

router.get("/", getHotels);
router.get("/id/:id", getHotel);
router.get("/countByCity", getHotelCountByCity);
router.get("/countByType", getHotelCountByType);
router.get("/allHotelCountByCity", getAllCityHotelCount);
router.get("/rooms/:id", getHotelRooms);
router.get("/allCities", getAllCities);

export default router;
