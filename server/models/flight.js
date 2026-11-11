import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
        airline: { type: String, required: true },
        flightNumber: { type: String, required: true },
        departAt: { type: String, required: true },
        arriveAt: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: Number, required: true },
        seatsAvailable: { type: Number, required: true },
        travelClass: { type: String, default: "Economy" },
        image: { type: String },
        rating: { type: Number, default: 4.2 },
    },
    { timestamps: true }
);

export default mongoose.model("Flight", FlightSchema, "flightCollection");
