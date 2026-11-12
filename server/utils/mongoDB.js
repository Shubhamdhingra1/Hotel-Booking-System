import mongoose from "mongoose";

const globalCache = globalThis;

if (!globalCache.__mongooseCache) {
    globalCache.__mongooseCache = { conn: null, promise: null };
}

const cache = globalCache.__mongooseCache;

export const ConnectDB = async () => {
    if (!process.env.MONGO_URI) {
        const err = new Error("MONGO_URI is not configured");
        err.status = 503;
        throw err;
    }

    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 10,
            })
            .then((mongooseInstance) => {
                console.log("Connected to MongoDB");
                cache.conn = mongooseInstance;
                return mongooseInstance;
            })
            .catch((error) => {
                cache.promise = null;
                console.error("MongoDB connection failed:", error.message);
                throw error;
            });
    }

    return cache.promise;
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    cache.conn = null;
    cache.promise = null;
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connection ready");
});
