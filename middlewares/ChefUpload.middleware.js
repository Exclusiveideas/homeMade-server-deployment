import { uploadImage } from "../lib/cloudinary.js";

// Middleware for uploading chef profile image
// ChefUpload.middleware.js
export const uploadProfilePicture = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const imagePath = req.file.path || req.file.url;
    const result = await uploadImage(imagePath, 'chef-profiles');
    req.body.profilePicture = result;
    next();
  } catch (err) {
    console.error("Error uploading chef profile image:", err);
    return res.status(500).json({ message: "Error uploading chef profile image." });
  }
};


export const uploadCertificates = async (req, res, next) => {
  if (!req.files || !Array.isArray(req.files)) return next();

  try {
    // Handle multiple files (check if local file path or external URL)
    const certificateUrls = await Promise.all(
      req.files.map(async (file) => {
        const imagePath = file.path || file.url; // Check for path or URL
        const result = await uploadImage(imagePath);
        return result; // Cloudinary URL for each certificate
      })
    );
    req.body.certificates = certificateUrls;
    next();
  } catch (err) {
    console.error("Error uploading certificates:", err);
    return res.status(500).json({ message: "Error uploading certificates." });
  }
};
