const router = require("express").Router();
const { ExperienceModel, UserModel } = require("../models");


router.post("/create", async (req, res) => {
  const { positionHeld, companyName, startDate, endDate, jobDesc, chef } = req.body;

  if (
    !positionHeld ||
    !companyName ||
    !startDate ||
    !endDate ||
    !jobDesc ||
    !chef
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create and save the new experience
    const newExperience = new ExperienceModel({
      positionHeld,
      companyName,
      startDate,
      endDate,
      jobDesc,
      chef,
    });

    const savedExperience = await newExperience.save();

    // Update the user's profile with the experience ID
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming `chef` is the ID of the user)
      { $push: { experiences: savedExperience._id } }, // Push the new experience ID to the experiences array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: "Error creating experience history",
      error: err.message,
    });
  }
});



//  Fetch one Experience
router.get("/fetch", async (req, res) => {
  const { experienceID } = req.query;
  
// Validate input
if (!experienceID) {
  return res.status(400).json({ message: "Experience ID is required" });
}

  try {
    // Find the experience by ID
    const experience = await ExperienceModel.findById(experienceID);

  // Check if the experience exists
  if (!experience) {
    return res.status(404).json({ message: "Experience not found" });
  }

    res.status(200).json(experience);  // Return the experience
  } catch (err) {
    res.status(500).json({ message: "Error fetching the experience", error: err.message });
  }
});



// Update Employment History
router.put("/update", async (req, res) => {
  const {
    _id: employmentID,
    chef,
    positionHeld,
    companyName,
    startDate,
    endDate,
    jobDesc,
  } = req.body;

  try {
    const employment = await ExperienceModel.findById(employmentID);

    // Check if the employment history exists
    if (!employment) {
      return res.status(404).json({ message: "Employment history not found" });
    }

    // Ensure the chef is the owner of the employment history
    if (employment.chef.toString() !== chef) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to update this employment history",
        });
    }

    // Update the employment history
    employment.positionHeld = positionHeld || employment.positionHeld;
    employment.companyName = companyName || employment.companyName;
    employment.startDate = startDate || employment.startDate;
    employment.endDate = endDate || employment.endDate;
    employment.jobDesc = jobDesc || employment.jobDesc;

    const updatedEmployment = await employment.save();

    // Return the updated employment history
    res.status(200).json({ message: 'Successfully updated'});
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error updating employment history",
        error: err.message,
      });
  }
});


// Delete Employment History
router.delete("/delete", async (req, res) => {
  const { experienceID } = req.query;
  const { chef } = req.body; // The logged-in chef
  
  if (!experienceID || !chef) {
    return res.status(400).json({ message: "Experience ID and Chef are required" });
  }

  try {
    // Find the employment history
    const employment = await ExperienceModel.findById(experienceID);

    // Check if the employment history exists
    if (!employment) {
      return res.status(404).json({ message: "Employment history not found" });
    }

    // Ensure the chef is the owner of the employment history
    if (employment.chef.toString() !== chef) {
      return res.status(403).json({
        message: "You are not authorized to delete this employment history",
      });
    }

    // Delete the employment history
    const deletedExperience = await ExperienceModel.findByIdAndDelete(experienceID);

    // Remove the experience ID from the user's experiences array
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming `chef` is the user ID)
      { $pull: { experiences: experienceID } }, // Remove the experience ID from the experiences array
      { new: true } // Return the updated user document
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Employment history deleted and removed from user profile successfully",
      deletedExperience
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting employment history",
      error: err.message,
    });
  }
});


module.exports = router;
