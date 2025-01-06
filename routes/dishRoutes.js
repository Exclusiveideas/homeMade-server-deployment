const router = require("express").Router();
const { DishModel, UserModel } = require("../models");

// Create Dish
router.post("/create", async (req, res) => {
  const { name, description, images, chef } = req.body;

  // Check if all required fields are provided
  if (!name || !description || !images || !chef) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create the new dish
    const newDish = new DishModel({
      name,
      description,
      images,
      chef,
    });

    // Save the dish to the database
    const savedDish = await newDish.save();

    // Add the dish ID to the user's profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming `chef` is the user ID)
      { $push: { dishCatalogue: savedDish._id } }, // Add the dish ID to the dishes array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the created dish and updated user
    res.status(201).json({
      message: "Dish created and added to user profile successfully",
      dish: savedDish,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating dish", error: err.message });
  }
});

  

//  Fetch all dishes
  router.get("/", async (req, res) => {

    try {
      const dishes = await DishModel.find();  // Fetch all dishes
  
      if (!dishes || dishes.length === 0) {
        return res.status(200).json([]);  // Return empty array if no dishes found
      }
  
      res.status(200).json(dishes);  // Return the list of dishes
    } catch (err) {
      res.status(500).json({ message: "Error fetching dishes", error: err.message });
    }
  });


//  Fetch one dishes
  router.get("/fetch", async (req, res) => {
    const { dishID } = req.query;
    
  // Validate input
  if (!dishID) {
    return res.status(400).json({ message: "Dish ID is required" });
  }

    try {
      // Find the dish by ID
      const dish = await DishModel.findById(dishID);
  
    // Check if the dish exists
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
  
      res.status(200).json(dish);  // Return the dish
    } catch (err) {
      res.status(500).json({ message: "Error fetching the dish", error: err.message });
    }
  });
  

// Update a dish
router.put("/update", async (req, res) => {
    const { _id: dishID, name, description, chef } = req.body;
  
    if (!dishID || !name || !description || !chef) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const updatedDish = await DishModel.findOneAndUpdate(
        { _id: dishID, chef },  // Ensure the chef is the one updating the dish
        { name, description },  // Update the dish name and description
        { new: true }  // Return the updated dish
      );
  
      if (!updatedDish) {
        return res.status(404).json({ message: "Dish not found or you are not the owner" });
      }
  
      res.status(200).json(updatedDish);  // Return the updated dish
    } catch (err) {
      res.status(500).json({ message: "Error updating dish", error: err.message });
    }
  });
  

// Delete a dish
router.delete("/delete", async (req, res) => {
  const { dishID } = req.query;
  const { chef } = req.body; // Logged-in chef (user ID)


  // Validate input
  if (!dishID || !chef) {
    return res.status(400).json({ message: "Dish ID and Chef are required" });
  }

  try {
    // Find the dish by ID
    const dish = await DishModel.findById(dishID);

    // Check if the dish exists
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Ensure the logged-in chef owns the dish
    if (dish.chef.toString() !== chef) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this dish" });
    }

    // Delete the dish
    const deletedDish = await DishModel.findByIdAndDelete(dishID);

    // Remove the dish ID from the user's dishCatalogue array
    const updatedUser = await UserModel.findByIdAndUpdate(
      chef, // User ID (assuming chef is the user ID)
      { $pull: { dishCatalogue: dishID } }, // Remove the dish ID from the array
      { new: true } // Return the updated user document
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success message
    res.status(200).json({
      message: "Dish deleted successfully and removed from user's catalogue",
      deletedDish
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting dish", error: err.message });
  }
});



module.exports = router;