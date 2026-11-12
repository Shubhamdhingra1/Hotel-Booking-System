import ServiceBooking from "../models/serviceBooking.js";
import {
    allSeatIdsForCapacity,
    getFlightCapacity,
} from "../utils/flightSeatLayout.js";

export function normalizeSeatId(value) {
    return String(value || "")
        .toUpperCase()
        .trim();
}

/** Booked seats come only from the flight document (updated on each booking). */
export function getBookedSeatIds(flight) {
    const ids = (flight?.bookedSeats || []).map(normalizeSeatId).filter(Boolean);
    return [...new Set(ids)];
}

export function getAvailableSeatIds(flight) {
    const all = allSeatIdsForCapacity(getFlightCapacity(flight));
    const booked = new Set(getBookedSeatIds(flight));
    return all.filter((id) => !booked.has(id));
}

/** Keeps totalSeats, bookedSeats, and seatsAvailable consistent. */
export function syncFlightSeatCounts(flight) {
    const total = getFlightCapacity(flight);
    const booked = getBookedSeatIds(flight);
    flight.totalSeats = total;
    flight.bookedSeats = booked;
    flight.seatsAvailable = Math.max(0, total - booked.length);
    return flight;
}

export function initialFlightSeatFields(totalSeats = 36) {
    return {
        totalSeats,
        bookedSeats: [],
        seatsAvailable: totalSeats,
    };
}

/** Rebuild bookedSeats from confirmed flight service bookings (source of truth repair). */
export async function rebuildBookedSeatsFromBookings(flightId) {
    const bookings = await ServiceBooking.find({
        serviceType: "flight",
        itemId: flightId,
        status: { $in: ["confirmed", "pending"] },
    }).select("selectedSeats");

    const seats = [];
    bookings.forEach((b) => {
        (b.selectedSeats || []).forEach((s) => seats.push(normalizeSeatId(s)));
    });

    return [...new Set(seats.filter(Boolean))];
}
