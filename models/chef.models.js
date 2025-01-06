import mongoose from "mongoose";

const chefSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    bio: {
      type: String,
    },
    specialties: {
      type: [String], // Array of strings
      default: [],
    },
    profilePicture: {
      type: String,
    },
    certificates: {
      type: [String], // Array of URLs for certificates
      default: [],
    },
    
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
chefSchema.index({ location: "2dsphere" });

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
