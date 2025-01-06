import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Modify uploadImage to accept folder as a parameter
export const uploadImage = async (imageFile, folder) => {
  try {
    let result;
    const folderPath = `homeMade/${folder}`; // Folder name passed as argument

    // Check if it's a URL or a local file
    if (imageFile.startsWith('http')) {
      result = await cloudinary.v2.uploader.upload(imageFile, {
        folder: folderPath,
        use_filename: true,
        unique_filename: false,
      });
    } else {
      result = await cloudinary.v2.uploader.upload(imageFile, {
        folder: folderPath,
        use_filename: true,
        unique_filename: false,
      });
    }

    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};

// Delete image function with fallback and checks for publicId
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("Invalid image URL provided.");
    }

    const parts = imageUrl.split("/");
    if (parts.length < 2) {
      throw new Error("Malformed image URL.");
    }

    const lastPart = parts.pop(); 
    const publicId = lastPart.split(".")[0]; 
    if (!publicId) {
      throw new Error("Unable to extract public ID from image URL.");
    }

    const folderPath = "homeMade/chef-profiles/";
    const fullPublicId = `${folderPath}${publicId}`;

    const result = await cloudinary.v2.uploader.destroy(fullPublicId);
    return result; 
  } catch (error) {
    throw new Error("Error deleting image from Cloudinary: " + error.message);
  }
};

