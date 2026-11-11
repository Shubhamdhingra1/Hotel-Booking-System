/** Cloudinary raw PDFs often break in-browser; image delivery path usually works. */
export function pdfDeliveryUrl(url, mimeType) {
    if (!url || typeof url !== "string") return url;
    const isPdf =
        mimeType === "application/pdf" || /\.pdf(\?|#|$)/i.test(url);
    if (!isPdf || !url.includes("res.cloudinary.com")) return url;
    if (url.includes("/raw/upload/")) {
        return url.replace("/raw/upload/", "/image/upload/");
    }
    return url;
}

/** Normalize verification documents for MongoDB (url + metadata only; file binary stays on Cloudinary). */
export function normalizeListingDocuments(raw) {
    if (!Array.isArray(raw)) return [];

    return raw
        .map((entry) => {
            if (!entry) return null;
            const url =
                typeof entry === "string"
                    ? entry.trim()
                    : typeof entry.url === "string"
                      ? entry.url.trim()
                      : "";
            if (!url) return null;

            const name =
                (typeof entry === "object" && entry.name ? String(entry.name) : "Document").trim() ||
                "Document";

            let mimeType =
                typeof entry === "object" && entry.mimeType ? String(entry.mimeType).trim() : "";
            if (!mimeType) {
                if (/\.pdf(\?|$)/i.test(url)) mimeType = "application/pdf";
                else if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)) mimeType = "image/jpeg";
                else mimeType = "application/octet-stream";
            }

            return { name, url, mimeType };
        })
        .filter(Boolean);
}

export function normalizeListingImages(rawImages, primaryImage) {
    const urls = [];
    if (Array.isArray(rawImages)) {
        rawImages.forEach((u) => {
            if (typeof u === "string" && u.trim() && !urls.includes(u.trim())) {
                urls.push(u.trim());
            }
        });
    }
    if (typeof primaryImage === "string" && primaryImage.trim() && !urls.includes(primaryImage.trim())) {
        urls.unshift(primaryImage.trim());
    }
    return urls;
}
