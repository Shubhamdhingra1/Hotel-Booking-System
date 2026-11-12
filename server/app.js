import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import hotelRoutes from "./routes/hotels.js";
import flightRoutes from "./routes/flights.js";
import carRoutes from "./routes/cars.js";
import serviceBookingRoutes from "./routes/serviceBookings.js";

import { buildCorsOptions } from "./config/cors.js";
import { ensureDbReady } from "./middleware/ensureDbReady.js";
import { errorHandler } from "./utils/errorHandler.js";
import { isDbConnected } from "./utils/mongoDB.js";

export function createApp() {
    const app = Express();

    app.use(cors(buildCorsOptions()));
    app.use(cookieParser());
    app.use(Express.json());
    app.use(ensureDbReady);

    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/user", userRoutes);
    app.use("/api/v1/room", roomRoutes);
    app.use("/api/v1/hotel", hotelRoutes);
    app.use("/api/v1/flight", flightRoutes);
    app.use("/api/v1/car", carRoutes);
    app.use("/api/v1/service-booking", serviceBookingRoutes);

    app.get("/api/v1/health", (_req, res) => {
        res.json({
            ok: true,
            dbConnected: isDbConnected(),
        });
    });

    app.use(errorHandler);

    return app;
}
