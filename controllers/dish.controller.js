import Dish from "../models/dish.model.js";

// DishController object to handle dish-related operations
export const DishController = {
  // Method to create a new dish
  createDish: async (req, res) => {
    try {
      const { name, description, price, category, available, chef, images } = req.body;

      // Validate required fields
      if (!name || !description || !chef) {
        return res.status(400).json({ message: "Name, description, and chef are required fields." });
      }

      // Create a new dish object
      const newDish = new Dish({
        name,
        description,
        price,
        category,
        available,
        chef,    // Add chef to the dish object
        images,  // Add images array
      });

      // Save the new dish to the database
      const savedDish = await newDish.save();

      // Return the success message along with the saved dish details
      res.status(201).json({
        message: "Dish created successfully",
        dish: savedDish,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating dish", error: error.message });
    }
  },

  // Method to get all dishes
  getAllDishes: async (req, res) => {
    try {
      // Fetch all dishes from the database and populate the chef field
      const dishes = await Dish.find();

      // Return the dishes as a response
      res.status(200).json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching dishes", error: error.message });
    }
  },

  // Method to get a specific dish by ID
  getDishById: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch a dish from DB by its ID
      const dish = await Dish.findById(id);

      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }

      res.status(200).json(dish);
    } catch (error) {
      res.status(500).json({ message: "Error fetching dish", error: error.message });
    }
  },

  // Method to update a dish
  updateDish: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, available, chef, images } = req.body;

      // Update the dish in the database
      const updatedDish = await Dish.findByIdAndUpdate(
        id,
        { name, description, price, category, available, chef, images }, // Include chef and images
        { new: true } // Returns the updated dish
      );

      if (!updatedDish) {
        return res.status(404).json({ message: "Dish not found" });
      }

      res.status(200).json({ message: "Dish updated successfully", dish: updatedDish });
    } catch (error) {
      res.status(500).json({ message: "Error updating dish", error: error.message });
    }
  },

  // Method to delete a dish
  deleteDish: async (req, res) => {
    try {
      const { id } = req.params;

      // Delete the dish from the database
      const deletedDish = await Dish.findByIdAndDelete(id);

      if (!deletedDish) {
        return res.status(404).json({ message: "Dish not found" });
      }

      res.status(200).json({ message: "Dish deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting dish", error: error.message });
    }
  },
};

