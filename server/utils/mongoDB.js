import mongoose from "mongoose";

export const ConnectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing. Set it in server/.env");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error(
            "Atlas: MongoDB Atlas → Network Access → add your current IP (or 0.0.0.0/0 for dev only)."
        );
    }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});
mongoose.connection.on("connected", () => {
    console.log("MongoDB connection ready");
});
