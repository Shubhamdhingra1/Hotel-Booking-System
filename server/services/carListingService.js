import CarRental from "../models/carRental.js";
import { createError } from "../utils/createError.js";
import { hasBookableRentalDays, startOfToday } from "../utils/carAvailability.js";
import { normalizeListingDocuments, normalizeListingImages } from "../utils/listingFiles.js";
import { serializeCarListing } from "../utils/serializeListing.js";

/** Owner may refresh a submission (e.g. add missing PDFs) while still awaiting admin review. */
const RESUBMIT_STATUSES = new Set([
    "pending",
    "needs_reapproval",
    "expired",
    "rejected",
]);

export async function markExpiredPeerListings() {
    const today = startOfToday();
    await CarRental.updateMany(
        {
            isPeerListing: true,
            listingStatus: "approved",
            listUntil: { $lt: today },
        },
        { $set: { listingStatus: "needs_reapproval" } }
    );
}

const peerListingWindowQuery = () => {
    const today = startOfToday();
    return {
        listFrom: { $lte: today },
        listUntil: { $gte: today },
    };
};

export function buildPublicCarFilter(baseQuery = {}) {
    const today = startOfToday();
    return {
        ...baseQuery,
        $or: [
            { isPeerListing: { $ne: true }, listingStatus: { $in: ["approved", null] } },
            {
                isPeerListing: true,
                listingStatus: "approved",
                listFrom: { $lte: today },
                listUntil: { $gte: today },
            },
        ],
    };
}

export async function createPeerListing(payload, ownerId) {
    if (!payload.documents?.length) {
        throw createError(400, "Documents are required");
    }
    if (!payload.images?.length) {
        throw createError(400, "At least one car image is required");
    }

    const images = normalizeListingImages(payload.images, payload.image);
    const documents = normalizeListingDocuments(payload.documents);

    const doc = await CarRental.create({
        city: payload.city,
        company: payload.company || "Private host",
        model: payload.model,
        category: payload.category,
        seats: payload.seats,
        transmission: payload.transmission,
        pricePerDay: payload.pricePerDay,
        image: images[0] || "",
        images,
        documents,
        pickupNote: payload.pickupNote,
        distance: payload.distance,
        description: payload.description,
        listFrom: payload.listFrom,
        listUntil: payload.listUntil,
        isPeerListing: true,
        ownerId,
        listingStatus: "pending",
        unavailableDates: [],
        rating: 4.5,
    });

    const saved = await CarRental.findById(doc._id).select("documents images").lean();
    if (!saved?.documents?.length) {
        throw createError(
            500,
            "Verification documents could not be saved. Restart the API server and try again."
        );
    }

    return doc;
}

export async function resubmitPeerListing(carId, ownerId, payload) {
    const car = await CarRental.findById(carId);
    if (!car || !car.isPeerListing) {
        throw createError(404, "Listing not found");
    }
    if (String(car.ownerId) !== String(ownerId)) {
        throw createError(403, "Unauthorized");
    }
    if (!RESUBMIT_STATUSES.has(car.listingStatus)) {
        throw createError(400, "Listing cannot be resubmitted in its current state");
    }

    const images = normalizeListingImages(payload.images, payload.image);
    const documents = normalizeListingDocuments(payload.documents);

    const updated = await CarRental.findByIdAndUpdate(
        carId,
        {
            $set: {
                city: payload.city,
                company: payload.company || car.company,
                model: payload.model,
                category: payload.category,
                seats: payload.seats,
                transmission: payload.transmission,
                pricePerDay: payload.pricePerDay,
                image: images[0] || "",
                images,
                documents,
                pickupNote: payload.pickupNote,
                distance: payload.distance,
                description: payload.description,
                listFrom: payload.listFrom,
                listUntil: payload.listUntil,
                listingStatus: "pending",
                adminNote: "",
            },
        },
        { new: true, runValidators: true }
    );

    if (!updated?.documents?.length) {
        throw createError(500, "Verification documents could not be saved");
    }

    return updated;
}

export async function listOwnerCars(ownerId) {
    return CarRental.find({ isPeerListing: true, ownerId }).sort({ updatedAt: -1 });
}

export async function listPendingForAdmin() {
    await markExpiredPeerListings();
    const listings = await CarRental.find({ isPeerListing: true, listingStatus: "pending" })
        .sort({ createdAt: 1 });
    return listings.map((doc) => serializeCarListing(doc));
}

export async function reviewListing(carId, action, adminNote) {
    const car = await CarRental.findById(carId);
    if (!car || !car.isPeerListing) {
        throw createError(404, "Listing not found");
    }
    if (car.listingStatus !== "pending") {
        throw createError(400, "Only pending listings can be reviewed");
    }

    if (action === "approve") {
        const today = startOfToday();
        if (car.listUntil && car.listUntil < today) {
            throw createError(400, "Listing end date is in the past");
        }
        car.listingStatus = "approved";
        car.adminNote = adminNote || "";
    } else if (action === "reject") {
        car.listingStatus = "rejected";
        car.adminNote = adminNote || "Rejected by admin";
    } else {
        throw createError(400, "Invalid review action");
    }

    await car.save();
    return car;
}

export async function getCarForPublicView(carId) {
    await markExpiredPeerListings();
    const car = await CarRental.findById(carId);
    if (!car) return null;

    const today = startOfToday();
    const fleetOk = !car.isPeerListing && (car.listingStatus === "approved" || !car.listingStatus);
    const peerOk =
        car.isPeerListing &&
        car.listingStatus === "approved" &&
        car.listFrom <= today &&
        car.listUntil >= today;

    if (!(fleetOk || peerOk)) return null;
    if (!hasBookableRentalDays(car)) return null;
    return car;
}
