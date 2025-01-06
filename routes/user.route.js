import express from "express";
import { authenticate, protectRoute } from "../middlewares/auth.middleware.js"; // Correct import
import { updateUserProfile } from "../controllers/user.controller.js"; // Your controller

const router = express.Router();

// Example of the route with authentication middleware
router.put("/api/profile/update", authenticate, updateUserProfile); // Use 'authenticate' or 'protectRoute' here

export default router;

