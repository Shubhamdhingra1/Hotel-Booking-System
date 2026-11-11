import CarRental from "../models/carRental.js";
import {
    buildPublicCarFilter,
    getCarForPublicView,
    markExpiredPeerListings,
} from "../services/carListingService.js";
import { isCarAvailableForNights } from "../utils/carAvailability.js";

const buildPriceFilter = (min, max, field) => {
    const filter = {};
    const lo = Number(min);
    const hi = Number(max);
    if (!Number.isNaN(lo)) filter.$gte = lo;
    if (!Number.isNaN(hi)) filter.$lte = hi;
    return Object.keys(filter).length ? { [field]: filter } : {};
};

export const listPublicCars = async (req, res, next) => {
    try {
        await markExpiredPeerListings();

        const { min, max, limit, rentFrom, rentTo, city, ...rest } = req.query;
        const mongoQuery = { ...rest };
        delete mongoQuery.rentFrom;
        delete mongoQuery.rentTo;

        if (city?.trim()) {
            mongoQuery.city = {
                $regex: new RegExp(`^${city.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
            };
        }

        Object.assign(mongoQuery, buildPriceFilter(min, max, "pricePerDay"));

        const filter = buildPublicCarFilter(mongoQuery);
        const cap = Number(limit) || 50;
        let items = await CarRental.find(filter).limit(cap);

        if (rentFrom && rentTo) {
            items = items.filter((car) => isCarAvailableForNights(car, rentFrom, rentTo));
        }

        res.json(items);
    } catch (error) {
        next(error);
    }
};

export const getPublicCarById = async (req, res, next) => {
    try {
        const car = await getCarForPublicView(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(car);
    } catch (error) {
        next(error);
    }
};

export const listCarCities = async (_req, res, next) => {
    try {
        await markExpiredPeerListings();
        const filter = buildPublicCarFilter({});
        const cities = await CarRental.distinct("city", filter);
        res.json(cities.sort());
    } catch (error) {
        next(error);
    }
};
