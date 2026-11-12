import Flight from "../models/flight.js";
import CarRental from "../models/carRental.js";
import ServiceBooking from "../models/serviceBooking.js";
import { createError } from "../utils/createError.js";
import { assertCarBookable, blockCarRentalNights } from "./carBookingService.js";
import { blockFlightSeats } from "./flightBookingService.js";
import { getRentalNightTimestamps } from "../utils/carAvailability.js";

const modelByType = {
    flight: Flight,
    car: CarRental,
};

/** Creates a flight or car rental booking and adjusts inventory when required. */
export async function createTravelBooking(payload, userId) {
    const {
        serviceType,
        itemId,
        title,
        totalPrice,
        startDate,
        endDate,
        passengers,
        selectedSeats = [],
    } = payload;

    const Model = modelByType[serviceType];
    if (!Model) {
        throw createError(400, "Invalid service type");
    }

    const item = await Model.findById(itemId);
    if (!item) {
        throw createError(404, "Item not found");
    }

    if (serviceType === "flight") {
        if (!selectedSeats.length || selectedSeats.length !== passengers) {
            throw createError(400, "One seat must be selected per passenger");
        }
        await blockFlightSeats(itemId, selectedSeats);
    }

    if (serviceType === "car") {
        if (!startDate || !endDate) {
            throw createError(400, "Rental start and end dates are required");
        }
        assertCarBookable(item, startDate, endDate);
        const nights = getRentalNightTimestamps(startDate, endDate);
        await blockCarRentalNights(itemId, nights.map((t) => new Date(t)));
    }

    const booking = await ServiceBooking.create({
        serviceType,
        itemId,
        userId,
        title,
        totalPrice,
        startDate,
        endDate,
        passengers,
        selectedSeats: serviceType === "flight" ? selectedSeats : [],
    });

    return booking;
}
