import express from "express";
import { CertificationController } from "../controllers/certification.controller.js";

const router = express.Router();

// Routes for certification
router.post("/", CertificationController.createCertification); // Create certification
router.get("/:chefId", CertificationController.getCertificationsByChef); // Get certifications by chef ID
router.put("/:id", CertificationController.updateCertification); // Update certification
router.delete("/:id", CertificationController.deleteCertification); // Delete certification

export default router;

