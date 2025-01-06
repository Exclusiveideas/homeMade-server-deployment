import express from "express";
import multer from "multer";
import { uploadDishImage } from "../middlewares/DishUpload.middleware.js"; // Importing the dish upload middleware
import { DishController } from "../controllers/dish.controller.js"; // Import your dish controller

const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({
  dest: "uploads/", // Temporary location for file uploads
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Route for creating a new dish
router.post("/create", upload.single("dishImage"), uploadDishImage, DishController.createDish);

// Route for updating an existing dish
router.put("/update/:id", upload.single("dishImage"), uploadDishImage, DishController.updateDish);

// Route for fetching all dishes
router.get("/", DishController.getAllDishes);

// Route for fetching a single dish by ID
router.get("/:id", DishController.getDishById);

// Define the route to delete a dish
router.delete('/:id', DishController.deleteDish);
export default router;

