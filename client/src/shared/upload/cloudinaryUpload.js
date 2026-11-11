import axios from "axios";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  cloudinaryUploadUrl,
} from "./cloudinaryConfig";

const inferMime = (file) => {
  if (file.type) return file.type;
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (/\.(jpe?g|png|webp|gif)$/.test(name)) return "image/jpeg";
  return "application/octet-stream";
};

const isPdfFile = (file) => {
  const mime = inferMime(file);
  return mime === "application/pdf" || (file.name || "").toLowerCase().endsWith(".pdf");
};

async function postUpload(resourceType, file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
  const uploadRes = await axios.post(cloudinaryUploadUrl(resourceType), data);
  return uploadRes.data;
}

/**
 * Uploads to Cloudinary.
 * PDFs use the image API so browsers can open them (raw uploads often fail in the PDF viewer).
 */
export async function uploadFileToCloudinary(file) {
  const mimeType = inferMime(file);
  const pdf = isPdfFile(file);

  let cloudData;
  if (pdf) {
    try {
      cloudData = await postUpload("image", file);
    } catch {
      cloudData = await postUpload("auto", file);
    }
  } else if (mimeType.startsWith("image/")) {
    cloudData = await postUpload("image", file);
  } else {
    try {
      cloudData = await postUpload("raw", file);
    } catch {
      cloudData = await postUpload("auto", file);
    }
  }

  const url = cloudData.secure_url || cloudData.url;
  if (!url) {
    throw new Error("Upload did not return a URL");
  }

  return {
    url,
    originalName: file.name || "document",
    mimeType: pdf ? "application/pdf" : mimeType,
  };
}
