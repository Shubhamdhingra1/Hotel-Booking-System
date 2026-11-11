import { createError } from "../utils/createError.js";
import { normalizeListingDocuments, normalizeListingImages } from "../utils/listingFiles.js";

const parseDate = (value, label) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
        throw createError(400, `Invalid ${label}`);
    }
    d.setHours(0, 0, 0, 0);
    return d;
};

const requiredString = (value, label) => {
    const v = typeof value === "string" ? value.trim() : "";
    if (!v) throw createError(400, `${label} is required`);
    return v;
};

/** Validates body for a user-submitted peer car listing. */
export function validatePeerListingBody(body) {
    const listFrom = parseDate(body.listFrom, "list from date");
    const listUntil = parseDate(body.listUntil, "list until date");
    if (listUntil < listFrom) {
        throw createError(400, "List until must be on or after list from");
    }

    const seats = Number(body.seats);
    const pricePerDay = Number(body.pricePerDay);
    if (!Number.isFinite(seats) || seats < 1 || seats > 12) {
        throw createError(400, "Invalid seat count");
    }
    if (!Number.isFinite(pricePerDay) || pricePerDay < 1) {
        throw createError(400, "Invalid price per day");
    }

    const images = normalizeListingImages(body.images, body.image);

    if (!images.length) {
        throw createError(400, "At least one car image is required");
    }

    const documents = normalizeListingDocuments(body.documents);

    if (!documents.length) {
        throw createError(400, "Upload at least one document (RC, insurance, etc.)");
    }

    const pickupNote = requiredString(
        body.pickupNote || body.distance,
        "Pick-up note"
    );

    return {
        city: requiredString(body.city, "City"),
        company: body.company?.trim() || "Private host",
        model: requiredString(body.model, "Model"),
        category: requiredString(body.category, "Category"),
        seats,
        transmission: body.transmission?.trim() || "Automatic",
        pricePerDay,
        image: images[0],
        images,
        documents,
        pickupNote,
        distance: pickupNote,
        listFrom,
        listUntil,
        description: body.description?.trim() || "",
    };
}
