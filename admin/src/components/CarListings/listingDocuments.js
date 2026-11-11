import { documentDownloadUrl, documentViewUrl } from "../../shared/documentUrls";

/** Normalize listing docs from API (handles legacy rows saved before documents field existed). */
export function getListingDocuments(car) {
  if (!car) return [];
  const docs = car.documents;
  if (!Array.isArray(docs)) return [];

  const photoUrls = new Set(getListingImages(car));

  return docs.filter((d) => {
    if (!d?.url) return false;
    if (photoUrls.has(d.url)) return false;
    return true;
  });
}

export function getListingImages(car) {
  if (!car) return [];
  const urls = [];
  if (Array.isArray(car.images)) {
    car.images.forEach((u) => {
      if (u && typeof u === "string") urls.push(u);
    });
  }
  if (car.image && typeof car.image === "string" && car.image.trim()) {
    if (!urls.includes(car.image)) urls.unshift(car.image);
  }
  return urls;
}

const isImageDoc = (doc) =>
  (doc.mimeType && doc.mimeType.startsWith("image/")) ||
  (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(doc.url || "") &&
    doc.mimeType !== "application/pdf");

const CarListingDocuments = ({ car }) => {
  const docs = getListingDocuments(car);
  const carPhotoCount = getListingImages(car).length;

  return (
    <div className="carListingDocsPanel">
      <h3>Verification documents</h3>
      <p className="carListingDocsHint">RC, insurance, PUC — not vehicle marketing photos.</p>
      {docs.length === 0 ? (
        <p className="carListingDocsEmpty">
          {carPhotoCount > 0
            ? "No verification files saved (only car photos are on file). Ask the owner to upload PDFs or reject."
            : "No documents were saved. Ask the owner to resubmit with RC / insurance uploads."}
        </p>
      ) : (
        <ul className="carListingDocsList">
          {docs.map((doc) => {
            const viewUrl = documentViewUrl(doc.url, doc.mimeType);
            const downloadUrl = documentDownloadUrl(doc.url, doc.mimeType);
            return (
            <li key={doc._id || doc.url} className="carListingDocItem">
              {isImageDoc(doc) ? (
                <a href={viewUrl} target="_blank" rel="noreferrer" className="carListingDocThumbLink">
                  <img src={viewUrl} alt="" className="carListingDocThumb" />
                </a>
              ) : (
                <span className="carListingDocFileIcon" aria-hidden>
                  PDF
                </span>
              )}
              <div className="carListingDocMeta">
                <a href={viewUrl} target="_blank" rel="noreferrer">
                  {doc.name || "Document"} (view)
                </a>
                <a href={downloadUrl} download className="carListingDocDownload">
                  Download
                </a>
                <span className="carListingDocMime">{doc.mimeType || "File"}</span>
              </div>
            </li>
          );
          })}
        </ul>
      )}
    </div>
  );
};

export default CarListingDocuments;
