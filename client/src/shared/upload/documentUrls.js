const isPdfDoc = (url, mimeType) =>
  mimeType === "application/pdf" || /\.pdf(\?|#|$)/i.test(url || "");

/**
 * URL suitable for opening a PDF in the browser tab (Chrome PDF viewer).
 * Cloudinary raw URLs often fail — image/upload delivery works for PDFs.
 */
export function documentViewUrl(url, mimeType) {
  if (!url || !isPdfDoc(url, mimeType)) return url;
  if (!url.includes("res.cloudinary.com")) return url;

  if (url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", "/image/upload/");
  }
  return url;
}

/** Forces download with a sensible filename when Cloudinary serves inline. */
export function documentDownloadUrl(url, mimeType) {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (!isPdfDoc(url, mimeType)) return url;

  const [prefix, suffix] = url.split("/upload/");
  if (!suffix) return url;
  if (suffix.startsWith("fl_attachment/")) return url;
  return `${prefix}/upload/fl_attachment/${suffix}`;
}
