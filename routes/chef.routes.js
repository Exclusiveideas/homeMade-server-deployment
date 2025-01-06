import express from "express";


import {
  createChefProfile,
  getChefProfile,
  updateChefProfile,
  deleteChefProfile,
  getChefStats,
  addReview,
  getReviews,
  addBooking,
  getBookings,
} from "../controllers/chef.controller.js";
import { protectRoute, roleBasedAccess } from "../middlewares/auth.middleware.js";
import {
  uploadProfilePicture,
  uploadCertificates,
} from "../middlewares/ChefUpload.middleware.js";

const router = express.Router();

// Create chef profile
router.post(
  "/create",
  protectRoute,
  roleBasedAccess("chef"),
  uploadProfilePicture,
  uploadCertificates,
  createChefProfile
);

// Get chef profile
router.get("/", protectRoute, roleBasedAccess("chef"), getChefProfile);

// Update chef profile
router.put(
  "/update",
  protectRoute,
  roleBasedAccess("chef"),
  uploadProfilePicture,
  uploadCertificates,
  updateChefProfile
);

// Delete chef profile
router.delete("/profile", protectRoute, roleBasedAccess("chef"), deleteChefProfile);

// Get chef stats
router.get("/me", protectRoute, roleBasedAccess("chef"), getChefStats);


// Add a review for a chef
router.post("/reviews/:id", protectRoute, roleBasedAccess("user"), addReview);

// Get reviews for a chef
router.get("/reviews/:id", protectRoute, getReviews);

// Create a booking for a chef
router.post("/bookings/:id", protectRoute, roleBasedAccess("user"), addBooking);

// Get bookings for a chef
router.get("/bookings/:id", protectRoute, getBookings);

export default router;
