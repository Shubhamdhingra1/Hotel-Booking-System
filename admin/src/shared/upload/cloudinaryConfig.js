export const CLOUDINARY_CLOUD_NAME =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dkj5uclof";

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "HotelBook.com";

export const cloudinaryUploadUrl = (resourceType = "image") =>
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
