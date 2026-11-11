import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import hotelRoutes from "./routes/hotels.js";
import flightRoutes from "./routes/flights.js";
import carRoutes from "./routes/cars.js";
import serviceBookingRoutes from "./routes/serviceBookings.js";

import { errorHandler } from "./utils/errorHandler.js";
import { ConnectDB, isDbConnected } from "./utils/mongoDB.js";
import { seedTravelIfEmpty } from "./utils/seedTravel.js";

dotenv.config();
const app = Express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // allow requests from these origins
    optionsSuccessStatus: 200 // return a 200 status code for preflight requests
  };
  
// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(Express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/hotel', hotelRoutes);
app.use('/api/v1/flight', flightRoutes);
app.use('/api/v1/car', carRoutes);
app.use('/api/v1/service-booking', serviceBookingRoutes);

app.get("/api/v1/health", (_req, res) => {
    res.json({
        ok: true,
        dbConnected: isDbConnected(),
    });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8080;

const startServer = async () => {
    await ConnectDB();
    await seedTravelIfEmpty();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();