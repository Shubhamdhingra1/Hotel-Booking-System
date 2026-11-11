import mongoose from "mongoose";

const ServiceBookingSchema = new mongoose.Schema(
    {
        serviceType: {
            type: String,
            enum: ["flight", "car"],
            required: true,
        },
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        passengers: { type: Number, default: 1 },
        status: { type: String, default: "confirmed" },
    },
    { timestamps: true }
);

export default mongoose.model("ServiceBooking", ServiceBookingSchema, "serviceBookingCollection");
