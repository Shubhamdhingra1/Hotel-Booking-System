import { pdfDeliveryUrl } from "./listingFiles.js";

/** Plain JSON for API responses (includes images + verification documents). */
export function serializeCarListing(doc) {
    if (!doc) return null;
    const plain = typeof doc.toObject === "function" ? doc.toObject({ getters: false }) : { ...doc };
    const documents = (Array.isArray(plain.documents) ? plain.documents : []).map((d) => ({
        ...d,
        url: pdfDeliveryUrl(d.url, d.mimeType),
    }));
    return {
        ...plain,
        images: Array.isArray(plain.images) ? plain.images : [],
        documents,
    };
}
