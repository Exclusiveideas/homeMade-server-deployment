import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
    },
    description: {
      type: String,
      required: [true, "Dish description is required"],
    },
    images: {
      type: [String], // Array of image URLs from Firebase
      default: [],    // Initialize as an empty array
    },
    chef: {
      type: String,   // Store chef ID as a string
      required: true, // Ensure every dish has an associated chef
    },
    price: {
      type: Number,
      required: [true, "Dish price is required"],
    },
    category: {
      type: String,
      default: "General",
    },
    available: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0, // Initialize likes to 0
    },
  },
  {
    timestamps: true,
  }
);

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;

