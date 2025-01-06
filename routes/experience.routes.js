import express from "express";
import { ExperienceController } from "../controllers/experience.controller.js";

const router = express.Router();

// Routes for experience
router.post("/", ExperienceController.createExperience); // Create experience
router.get("/:chefId", ExperienceController.getExperiencesByChef); // Get experiences by chef ID
router.put("/:id", ExperienceController.updateExperience); // Update experience
router.delete("/:id", ExperienceController.deleteExperience); // Delete experience

export default router;

