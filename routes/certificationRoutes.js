const router = require("express").Router();
const { CertificationModel, UserModel } = require("../models");


// Create a Certification
router.post('/create', async (req, res) => {
  const { title, dateAwarded, description, images, chef } = req.body;

  // Validate input
  if (!title || !dateAwarded || !description || !images || !chef) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new certification
    const newCertification = new CertificationModel({
      title,
      dateAwarded,
      description,
      images,
      chef,
    });

    // Save the certification
    const savedCertification = await newCertification.save();

    // Add the certification ID to the user's certifications array
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming chef is the user ID)
      { $push: { certifications: savedCertification._id } }, // Add certification ID
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating certification", error: err.message });
  }
});


// Fetch one Certification
router.get("/fetch", async (req, res) => {
  const { certificationID } = req.query;
  
// Validate input
if (!certificationID) {
  return res.status(400).json({ message: "Certification ID is required" });
}

  try {
    // Find the certification by ID
    const certification = await CertificationModel.findById(certificationID);

  // Check if the certification exists
  if (!certification) {
    return res.status(404).json({ message: "Certification not found" });
  }

    res.status(200).json(certification);  // Return the certification
  } catch (err) {
    res.status(500).json({ message: "Error fetching the certification", error: err.message });
  }
});



// Delete a Certification
router.delete('/delete', async (req, res) => {
  const { certificationID } = req.query;
  const { chef } = req.body; // The logged-in chef

  // Validate input
  if (!certificationID) {
    return res.status(400).json({ message: "Certification ID is required" });
  }

  try {
    // Find the certification by ID
    const certification = await CertificationModel.findById(certificationID);

    // Check if the certification exists
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    // Ensure the chef is the owner of the certification
    if (certification.chef.toString() !== chef) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this certification" });
    }

    // Delete the certification
    const deletedCertification = await CertificationModel.findByIdAndDelete(certificationID);

    // Remove the certification ID from the user's certifications array
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming chef is the user ID)
      { $pull: { certifications: certificationID } }, // Remove certification ID
      { new: true } // Return the updated user document
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    res.status(200).json({
      message: "Certification deleted and removed from user's profile",
      deletedCertification
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting certification", error: err.message });
  }
});





module.exports = router;