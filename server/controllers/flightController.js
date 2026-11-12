import {
    getFlightPublicDetail,
    listFlightCities,
} from "../services/flightQueryService.js";

export const getFlightById = async (req, res, next) => {
    try {
        const detail = await getFlightPublicDetail(req.params.id);
        if (!detail) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(detail);
    } catch (error) {
        next(error);
    }
};

export const getFlightCities = async (_req, res, next) => {
    try {
        const cities = await listFlightCities();
        res.json(cities);
    } catch (error) {
        next(error);
    }
};
