import dotenv from "dotenv";
import { ConnectDB } from "../utils/mongoDB.js";
import { reseedTravelData } from "../utils/seedTravel.js";
import mongoose from "mongoose";

dotenv.config();

await ConnectDB();
await reseedTravelData();
await mongoose.disconnect();
process.exit(0);
