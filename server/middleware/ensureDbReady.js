import { ConnectDB } from "../utils/mongoDB.js";
import { seedTravelIfEmpty } from "../utils/seedTravel.js";

let dataStorePrepared = false;

/** Connects Mongo (cached for serverless) and runs travel seed once per process. */
export async function prepareDataStore() {
    await ConnectDB();
    if (!dataStorePrepared) {
        await seedTravelIfEmpty();
        dataStorePrepared = true;
    }
}

export async function ensureDbReady(req, res, next) {
    try {
        await prepareDataStore();
        next();
    } catch (err) {
        next(err);
    }
}
