import express from "express";
import {
    adminReviewListing,
    getMyCarListings,
    getPendingListings,
    resubmitListing,
    submitPeerListing,
} from "../controllers/carListingController.js";
import { getPublicCarById, listCarCities, listPublicCars } from "../controllers/carListController.js";
import { verifyAdmin, verifyToken } from "../utils/verification.js";

const router = express.Router();

router.get("/", listPublicCars);
router.get("/id/:id", getPublicCarById);
router.get("/cities", listCarCities);

router.post("/listings", verifyToken, submitPeerListing);
router.get("/listings/mine", verifyToken, getMyCarListings);
router.patch("/listings/:id/resubmit", verifyToken, resubmitListing);

router.get("/admin/pending", verifyAdmin, getPendingListings);
router.patch("/admin/:id/review", verifyAdmin, adminReviewListing);

export default router;
