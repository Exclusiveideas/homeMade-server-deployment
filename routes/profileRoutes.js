const router = require("express").Router();
const { UserModel } = require("../models");


// Get Profile
router.get("/", async (req, res) => {
    const { userID } = req.query;

    if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
    }
    
    try {
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove sensitive information (password) from the response
        const { password, ...others } = user._doc;
        return res.status(200).json({ user: others });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again later." });
    }
});


// Update Profile
router.put("/update", async (req, res) => {
    const { _id: userID } = req.body;

    if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        
        const { name, email, languages, rates, title, location, position, profilePic, profileOverview, dishCatalogue, experiences, certifications, chats, role } = req.body;

        const updatedData = { name, email, languages, rates, title, location, position, profilePic, profileOverview, dishCatalogue, experiences, certifications, chats, role };

        // Find the user by userID and update the user's profile with the updated data
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: userID }, // Find by userID
          { $set: updatedData }, // Set the updated data
          { new: true } // Return the updated document
        );

        // If the user is not found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove sensitive information (password) from the response
        const { password, ...others } = updatedUser._doc;

        return res.status(200).json(others);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again later." });
    }
});



module.exports = router;