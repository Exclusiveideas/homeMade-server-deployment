const router = require("express").Router();
const { UserModel } = require("../models");

// Get all chefs
router.get("/", async (req, res) => {
    try {
      // Find all users whose role is "chef"
      const chefs = await UserModel.find({ role: "chef" });

      if (!chefs || chefs.length === 0) {
        return res.status(200).json([]); // Return an empty array if no chef found
      }
  
      // Remove password field from each chef's data before sending it to the client
      const chefsData = chefs.map(chef => {
        const { password, ...chefInfo } = chef._doc;
        return chefInfo;
      });
  
      // Respond with the array of chef profiles
      return res.status(200).json(chefsData);
  
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "An error occurred. Please try again later." });
    }
  });
  
  
module.exports = router;