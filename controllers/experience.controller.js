import Experience from "../models/experience.model.js";

// Controller for Experience
export const ExperienceController = {
  // Create a new experience
  createExperience: async (req, res) => {
    try {
      const { positionHeld, companyName, startDate, endDate, jobDesc, chef } = req.body;

      const newExperience = new Experience({
        positionHeld,
        companyName,
        startDate,
        endDate,
        jobDesc,
        chef,
      });

      const savedExperience = await newExperience.save();
      res.status(201).json({
        message: "Experience created successfully",
        experience: savedExperience,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating experience", error: error.message });
    }
  },

  // Get experiences by chef ID
  getExperiencesByChef: async (req, res) => {
    try {
      const { chefId } = req.params;
      const experiences = await Experience.find({ chef: chefId });

      if (!experiences.length) {
        return res.status(404).json({ message: "No experiences found for this chef" });
      }

      res.status(200).json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Error fetching experiences", error: error.message });
    }
  },

  // Update an experience
  updateExperience: async (req, res) => {
    try {
      const { id } = req.params;
      const { positionHeld, companyName, startDate, endDate, jobDesc } = req.body;

      const updatedExperience = await Experience.findByIdAndUpdate(
        id,
        { positionHeld, companyName, startDate, endDate, jobDesc },
        { new: true }
      );

      if (!updatedExperience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      res.status(200).json({ message: "Experience updated successfully", experience: updatedExperience });
    } catch (error) {
      res.status(500).json({ message: "Error updating experience", error: error.message });
    }
  },

  // Delete an experience
  deleteExperience: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedExperience = await Experience.findByIdAndDelete(id);
      if (!deletedExperience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      res.status(200).json({ message: "Experience deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting experience", error: error.message });
    }
  },
};

