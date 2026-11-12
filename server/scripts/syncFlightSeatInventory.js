/**
 * Reconcile flight seat inventory from ServiceBooking records (or clear for demo).
 *
 *   node scripts/syncFlightSeatInventory.js
 *   node scripts/syncFlightSeatInventory.js --from-bookings
 *   node scripts/syncFlightSeatInventory.js --clear-booked
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Flight from "../models/flight.js";
import {
    rebuildBookedSeatsFromBookings,
    syncFlightSeatCounts,
} from "../services/flightSeatInventory.js";

dotenv.config();

const clearBooked = process.argv.includes("--clear-booked");
const fromBookings =
    process.argv.includes("--from-bookings") ||
    (!clearBooked && !process.argv.includes("--no-rebuild"));

async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI missing in server/.env");
    }
    await mongoose.connect(uri);
    const flights = await Flight.find({});
    let updated = 0;

    for (const flight of flights) {
        if (clearBooked) {
            flight.bookedSeats = [];
        } else if (fromBookings) {
            flight.bookedSeats = await rebuildBookedSeatsFromBookings(flight._id);
        }
        syncFlightSeatCounts(flight);
        await flight.save();
        updated += 1;
    }

    const mode = clearBooked
        ? "cleared all bookedSeats"
        : fromBookings
          ? "rebuilt from service bookings"
          : "synced counts only";
    console.log(`Updated ${updated} flight(s) — ${mode}.`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
