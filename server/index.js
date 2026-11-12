import dotenv from "dotenv";

import { createApp } from "./app.js";
import { startLocalServer } from "./bootstrap.js";

dotenv.config();

const app = createApp();

if (!process.env.VERCEL) {
    startLocalServer(app).catch((err) => {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    });
}

export default app;
