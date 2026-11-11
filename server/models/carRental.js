import mongoose from "mongoose";

const CarRentalSchema = new mongoose.Schema(
    {
        city: { type: String, required: true },
        company: { type: String, required: true },
        model: { type: String, required: true },
        category: { type: String, required: true },
        seats: { type: Number, required: true },
        transmission: { type: String, default: "Automatic" },
        pricePerDay: { type: Number, required: true },
        image: { type: String },
        images: [{ type: String }],
        documents: [
            {
                name: { type: String, trim: true },
                url: { type: String, required: true },
                mimeType: { type: String },
            },
        ],
        pickupNote: { type: String, trim: true },
        rating: { type: Number, default: 4.3 },
        distance: { type: String, default: "Pick-up downtown" },
        description: { type: String, trim: true },
        /** User-submitted vehicle awaiting / under admin listing lifecycle */
        isPeerListing: { type: Boolean, default: false },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        listingStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "expired", "needs_reapproval"],
            default: "approved",
        },
        listFrom: { type: Date },
        listUntil: { type: Date },
        unavailableDates: { type: [Date], default: [] },
        adminNote: { type: String, trim: true },
    },
    { timestamps: true, minimize: false }
);

export default mongoose.model("CarRental", CarRentalSchema, "carRentalCollection");
