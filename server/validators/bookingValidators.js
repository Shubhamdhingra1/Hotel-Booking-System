import { createError } from "../utils/createError.js";

const SERVICE_TYPES = new Set(["flight", "car"]);

/** Validates travel service booking request body. */
export function validateServiceBookingBody(body) {
    const { serviceType, itemId, title, totalPrice } = body || {};

    if (!serviceType || !itemId || !title || totalPrice == null) {
        throw createError(400, "Missing booking fields");
    }
    if (!SERVICE_TYPES.has(serviceType)) {
        throw createError(400, "Invalid service type");
    }

    return {
        serviceType,
        itemId,
        title,
        totalPrice: Number(totalPrice),
        startDate: body.startDate,
        endDate: body.endDate,
        passengers: Math.max(1, Number(body.passengers) || 1),
    };
}

/** Ensures room availability payload contains at least one date. */
export function validateRoomDatesBody(body) {
    if (!body?.dates || !Array.isArray(body.dates) || body.dates.length === 0) {
        throw createError(400, "No valid booking dates provided");
    }
    return body.dates;
}
