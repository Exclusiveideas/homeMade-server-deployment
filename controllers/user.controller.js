import mongoose from "mongoose";
import User from "../models/user.models.js";  // Correct model import

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming the user ID is stored in req.user (from the authMiddleware)
    const { 
      name, 
      email, 
      languages, 
      profilePic, 
      longitude, 
      latitude, 
      dishCatalogue, 
      experiences, 
      certifications, 
      chats // Ensure this is an array of ObjectIds or strings
    } = req.body;

    // Convert chat IDs into proper ObjectIds if they are not already ObjectId instances
    const chatRoomIds = chats.map((chat) => {
      // Ensure the chat ID is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(chat)) {
        return mongoose.Types.ObjectId(chat); // Convert string to ObjectId
      }
      return chat; // Otherwise, leave as is (if it's already an ObjectId)
    });

    // Find and update the user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        languages,
        profilePic,
        position: { longitude, latitude },
        dishCatalogue,
        experiences,
        certifications,
        chats: chatRoomIds,  // Update the chats field with proper ObjectIds
      },
      { new: true, runValidators: true }
    ).populate("dishCatalogue experiences certifications chats"); // Populate references if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

