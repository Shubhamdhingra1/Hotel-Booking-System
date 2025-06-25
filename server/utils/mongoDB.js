import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => { console.log("Disconnected"); });
mongoose.connection.on("connected", () => { console.log("Connected to MongoDB"); });
