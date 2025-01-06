import { uploadImage } from "../lib/cloudinary.js";

// Middleware for uploading dish images
export const uploadDishImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const imagePath = req.file.path || req.file.url; // Use path or URL

    // Here, 'dish-images' is the folder for dish images
    const result = await uploadImage(imagePath, 'dish-images'); 

    req.body.dishImage = result; // Cloudinary URL for the dish image
    next();
  } catch (err) {
    console.error("Error uploading dish image:", err);
    return res.status(500).json({ message: "Error uploading dish image." });
  }
};

