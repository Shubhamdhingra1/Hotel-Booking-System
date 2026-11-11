import express from "express";
import Flight from "../models/flight.js";
import { makeGetByIdHandler, makeListHandler } from "../controllers/travel/listingController.js";

const router = express.Router();

router.get("/", makeListHandler(Flight, "price"));
router.get("/id/:id", makeGetByIdHandler(Flight));
router.get("/cities", async (_req, res, next) => {
    try {
        const from = await Flight.distinct("from");
        const to = await Flight.distinct("to");
        const cities = [...new Set([...from, ...to])].sort();
        res.json(cities);
    } catch (error) {
        next(error);
    }
});

export default router;
