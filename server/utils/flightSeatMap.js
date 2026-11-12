import {
    SEAT_LETTERS_LEFT,
    SEAT_LETTERS_RIGHT,
    allSeatIdsForCapacity,
    getFlightCapacity,
} from "./flightSeatLayout.js";
import {
    getAvailableSeatIds,
    getBookedSeatIds,
} from "../services/flightSeatInventory.js";

export { DEFAULT_TOTAL_SEATS, getFlightCapacity } from "./flightSeatLayout.js";

/** Rows for the seat-picker UI. */
export function buildSeatMapRows(flight) {
    const total = getFlightCapacity(flight);
    const booked = new Set(getBookedSeatIds(flight));
    const rowCount = Math.ceil(total / 6);
    const rows = [];

    for (let row = 1; row <= rowCount; row++) {
        const buildSide = (letters) =>
            letters.map((letter) => {
                const id = `${row}${letter}`;
                const inCabin = allSeatIdsForCapacity(total).includes(id);
                return {
                    id,
                    label: letter,
                    row,
                    status: !inCabin ? "none" : booked.has(id) ? "booked" : "available",
                };
            });

        rows.push({
            row,
            left: buildSide(SEAT_LETTERS_LEFT),
            right: buildSide(SEAT_LETTERS_RIGHT),
        });
    }

    return rows;
}

export function buildSeatMapPayload(flight) {
    const totalSeats = getFlightCapacity(flight);
    const available = getAvailableSeatIds(flight);
    return {
        totalSeats,
        seatsAvailable: available.length,
        bookedSeats: getBookedSeatIds(flight),
        rows: buildSeatMapRows(flight),
    };
}

export function assertSeatsSelectable(flight, seatIds) {
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
        return { ok: false, message: "Select at least one seat" };
    }

    const normalized = seatIds.map((s) => String(s).toUpperCase().trim());
    const unique = new Set(normalized);
    if (unique.size !== normalized.length) {
        return { ok: false, message: "Duplicate seats selected" };
    }

    const allowed = new Set(getAvailableSeatIds(flight));
    const allValid = allSeatIdsForCapacity(getFlightCapacity(flight));

    for (const id of normalized) {
        if (!allValid.includes(id)) {
            return { ok: false, message: `Invalid seat ${id}` };
        }
        if (!allowed.has(id)) {
            return { ok: false, message: `Seat ${id} is already taken` };
        }
    }

    return { ok: true, seatIds: normalized };
}
