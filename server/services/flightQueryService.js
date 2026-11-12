import Flight from "../models/flight.js";
import { buildSeatMapPayload } from "../utils/flightSeatMap.js";

/** Public flight detail including live seat map (booked seats from inventory only). */
export async function getFlightPublicDetail(flightId) {
    const flight = await Flight.findById(flightId);
    if (!flight) {
        return null;
    }

    const seatMap = buildSeatMapPayload(flight);

    return {
        ...flight.toObject(),
        seatMap,
        seatsAvailable: seatMap.seatsAvailable,
        bookedSeats: seatMap.bookedSeats,
    };
}

export async function listFlightCities() {
    const [from, to] = await Promise.all([
        Flight.distinct("from"),
        Flight.distinct("to"),
    ]);
    return [...new Set([...from, ...to])].sort();
}
