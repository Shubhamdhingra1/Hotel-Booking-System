import dotenv from "dotenv";
import { ConnectDB } from "../utils/mongoDB.js";
import { reseedCarRentals } from "../utils/seedTravel.js";

dotenv.config();
await ConnectDB();
await reseedCarRentals();
process.exit(0);
