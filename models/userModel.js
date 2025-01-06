const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    email: { type: String, required: true, unique: true, trim: true }, // a value is required upon creation
    password: { type: String, required: true, trim: true }, // a value is required upon creation
    role: {
      type: String,
      enum: ["chef", "client", ""], // Allowed values
      default: "", // Default value 
      trim: true,
    },
    rates: { type: String, default: "" },
    languages: { type: String, default: "" },
    title: { type: String, default: "" },
    location: {
      type: String,
      default: "", // Default empty string
      trim: true,
    },
    position: {
      longitude: { type: String, default: "" },
      latitude: { type: String, default: "" },
    },
    profilePic: {
      type: String,
      default: "", // Default empty string for profile picture
      trim: true,
    },
    profileOverview: {
      type: String,
      default: "",
      trim: true,
    },
    dishCatalogue: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Dish', // Reference to the DishModel
      default: [],  
    },
    experiences: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Experience', // Reference to the ExperienceModel
      default: [],  
    },
    certifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Certification', // Reference to the CertificationModel
      default: [],  
    },
    chats: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'ChatRoom', // Reference to the ChatRoomModel
      default: [],  
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);