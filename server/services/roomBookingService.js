import Room from "../models/room.js";
import { normalizeBookedDates } from "../utils/roomDates.js";
import { createError } from "../utils/createError.js";

/**
 * Marks a room number unavailable for the given nights (one DB entry per night).
 */
export async function blockRoomNights(roomNumberId, rawDates) {
    const dates = normalizeBookedDates(rawDates);

    if (!dates.length) {
        throw createError(400, "No valid booking dates provided");
    }

    const result = await Room.updateOne(
        { "roomNumbers._id": roomNumberId },
        {
            $push: {
                "roomNumbers.$.unavailableDates": { $each: dates },
            },
        }
    );

    if (result.matchedCount === 0) {
        throw createError(404, "Room number not found");
    }

    return { bookedDates: dates };
}
