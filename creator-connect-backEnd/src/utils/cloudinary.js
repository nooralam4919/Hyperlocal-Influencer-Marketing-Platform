import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary.
 * Deletes the temp file from disk regardless of success or failure.
 *
 * @param {string} localFilePath  - Absolute path to the temp file
 * @param {string} folder         - Cloudinary folder name (optional)
 * @returns {object|null}         - Cloudinary upload result or null on error
 */
const uploadOnCloudinary = async (localFilePath, folder = "creator-connect") => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    // Remove temp file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

/**
 * Deletes a file from Cloudinary by public_id.
 *
 * @param {string} publicId  - The Cloudinary public_id of the file
 * @returns {object|null}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
