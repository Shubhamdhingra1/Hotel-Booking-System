import Flight from "../models/flight.js";
import { createError } from "../utils/createError.js";
import { assertSeatsSelectable } from "../utils/flightSeatMap.js";
import {
    getAvailableSeatIds,
    getBookedSeatIds,
    syncFlightSeatCounts,
} from "./flightSeatInventory.js";

/** Reserve specific seats after validation; persists bookedSeats on the flight. */
export async function blockFlightSeats(flightId, seatIds) {
    const flight = await Flight.findById(flightId);
    if (!flight) {
        throw createError(404, "Flight not found");
    }

    const check = assertSeatsSelectable(flight, seatIds);
    if (!check.ok) {
        throw createError(400, check.message);
    }

    const merged = [...new Set([...getBookedSeatIds(flight), ...check.seatIds])];
    flight.bookedSeats = merged;
    syncFlightSeatCounts(flight);
    await flight.save();
    return flight;
}

export function assertEnoughSeatsForPassengers(flight, passengerCount) {
    const available = getAvailableSeatIds(flight).length;
    if (passengerCount > available) {
        throw createError(400, "Not enough seats available");
    }
}
