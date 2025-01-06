import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";

import chefRoutes from "./routes/chef.routes.js";
import dishRoutes from "./routes/dish.routes.js";

import experienceRoutes from "./routes/experience.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import chatroomRoutes from "./routes/chatroom.routes.js";
import userRoutes from "./routes/user.route.js";

// Load environment variables from .env file 
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Connect to MongoDB

connectDB();

// Routes
app.use("/api/", authRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/dish", dishRoutes);
app.use(userRoutes);

app.use("/api/experiences", experienceRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/chatrooms", chatroomRoutes);

app.use("/uploads", express.static("uploads"));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

