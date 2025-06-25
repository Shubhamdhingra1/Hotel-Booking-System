import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import hotelRoutes from "./routes/hotels.js";

import { errorHandler } from "./utils/errorHandler.js";
import { ConnectDB } from "./utils/mongoDB.js";

dotenv.config();
const app = Express();

ConnectDB();

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

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('Connected to Backend')
})