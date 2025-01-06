import Certification from "../models/certification.model.js";

// Controller for Certification
export const CertificationController = {
  // Create a new certification
  createCertification: async (req, res) => {
    try {
      const { title, dateAwarded, description, images, chef } = req.body;

      const newCertification = new Certification({
        title,
        dateAwarded,
        description,
        images,
        chef,
      });

      const savedCertification = await newCertification.save();
      res.status(201).json({
        message: "Certification created successfully",
        certification: savedCertification,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating certification", error: error.message });
    }
  },

  // Get certifications by chef ID
  getCertificationsByChef: async (req, res) => {
    try {
      const { chefId } = req.params;
      const certifications = await Certification.find({ chef: chefId });

      if (!certifications.length) {
        return res.status(404).json({ message: "No certifications found for this chef" });
      }

      res.status(200).json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certifications", error: error.message });
    }
  },

  // Update a certification
  updateCertification: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, dateAwarded, description, images } = req.body;

      const updatedCertification = await Certification.findByIdAndUpdate(
        id,
        { title, dateAwarded, description, images },
        { new: true }
      );

      if (!updatedCertification) {
        return res.status(404).json({ message: "Certification not found" });
      }

      res.status(200).json({ message: "Certification updated successfully", certification: updatedCertification });
    } catch (error) {
      res.status(500).json({ message: "Error updating certification", error: error.message });
    }
  },

  // Delete a certification
  deleteCertification: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedCertification = await Certification.findByIdAndDelete(id);
      if (!deletedCertification) {
        return res.status(404).json({ message: "Certification not found" });
      }

      res.status(200).json({ message: "Certification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting certification", error: error.message });
    }
  },
};

