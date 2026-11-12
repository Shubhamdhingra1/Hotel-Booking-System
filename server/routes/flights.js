import express from "express";
import Flight from "../models/flight.js";
import { makeListHandler } from "../controllers/travel/listingController.js";
import { getFlightById, getFlightCities } from "../controllers/flightController.js";

const router = express.Router();

router.get("/", makeListHandler(Flight, "price"));
router.get("/id/:id", getFlightById);
router.get("/cities", getFlightCities);

export default router;
