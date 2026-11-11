const isPdfDoc = (url, mimeType) =>
  mimeType === "application/pdf" || /\.pdf(\?|#|$)/i.test(url || "");

export function documentViewUrl(url, mimeType) {
  if (!url || !isPdfDoc(url, mimeType)) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", "/image/upload/");
  }
  return url;
}

export function documentDownloadUrl(url, mimeType) {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (!isPdfDoc(url, mimeType)) return url;
  const [prefix, suffix] = url.split("/upload/");
  if (!suffix || suffix.startsWith("fl_attachment/")) return url;
  return `${prefix}/upload/fl_attachment/${suffix}`;
}
