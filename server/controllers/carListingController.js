import {
    createPeerListing,
    listOwnerCars,
    listPendingForAdmin,
    resubmitPeerListing,
    reviewListing,
} from "../services/carListingService.js";
import { validatePeerListingBody } from "../validators/carListingValidators.js";
import { serializeCarListing } from "../utils/serializeListing.js";

export const submitPeerListing = async (req, res, next) => {
    try {
        const payload = validatePeerListingBody(req.body);
        const listing = await createPeerListing(payload, req.user.id);
        const plain = serializeCarListing(listing);
        res.status(201).json({
            success: true,
            listing: plain,
            documentCount: plain.documents?.length ?? 0,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyCarListings = async (req, res, next) => {
    try {
        const listings = await listOwnerCars(req.user.id);
        res.json(listings);
    } catch (error) {
        next(error);
    }
};

export const resubmitListing = async (req, res, next) => {
    try {
        const payload = validatePeerListingBody(req.body);
        const listing = await resubmitPeerListing(req.params.id, req.user.id, payload);
        const plain = serializeCarListing(listing);
        res.json({
            success: true,
            listing: plain,
            documentCount: plain.documents?.length ?? 0,
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingListings = async (req, res, next) => {
    try {
        const listings = await listPendingForAdmin();
        res.json(listings);
    } catch (error) {
        next(error);
    }
};

export const adminReviewListing = async (req, res, next) => {
    try {
        const { action, adminNote } = req.body || {};
        const listing = await reviewListing(req.params.id, action, adminNote);
        res.json({ success: true, listing });
    } catch (error) {
        next(error);
    }
};
