import express from "express";
import { login, logout, signup, resetPassword, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute, roleBasedAccess } from "../middlewares/auth.middleware.js";

const router = express.Router();
// Public routes
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.put("/auth/reset", resetPassword);
router.get("/auth/profile", getProfile);
//router.put("/profile/update", protectRoute, updateProfile);


// Protected routes
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

// Role-based protected routes
router.get("/chef-dashboard", protectRoute, roleBasedAccess('chef'), (req, res) => {
    // Chef dashboard logic
    res.json({ message: "Welcome to Chef Dashboard" });
});

export default router;
