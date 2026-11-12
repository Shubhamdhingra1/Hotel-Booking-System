import { prepareDataStore } from "./middleware/ensureDbReady.js";

export async function startLocalServer(app) {
    const port = Number(process.env.PORT) || 8080;

    await prepareDataStore();

    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
