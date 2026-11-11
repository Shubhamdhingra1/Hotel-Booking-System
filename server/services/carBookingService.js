import CarRental from "../models/carRental.js";
import { normalizeBookedDates } from "../utils/roomDates.js";
import { createError } from "../utils/createError.js";
import { isCarAvailableForNights } from "../utils/carAvailability.js";

/** Persists booked rental nights on a car (same pattern as hotel room numbers). */
export async function blockCarRentalNights(carId, rawDates) {
    const dates = normalizeBookedDates(rawDates);

    if (!dates.length) {
        throw createError(400, "No valid booking dates provided");
    }

    const result = await CarRental.updateOne(
        { _id: carId },
        { $push: { unavailableDates: { $each: dates } } }
    );

    if (result.matchedCount === 0) {
        throw createError(404, "Car not found");
    }

    return { bookedDates: dates };
}

export function assertCarBookable(car, startDate, endDate) {
    if (!car) {
        throw createError(404, "Item not found");
    }

    if (car.isPeerListing && car.listingStatus !== "approved") {
        throw createError(400, "This vehicle is not available for booking");
    }

    if (!isCarAvailableForNights(car, startDate, endDate)) {
        throw createError(400, "Car is not available for the selected dates");
    }
}
