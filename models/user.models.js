import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["client", "chef"], // Updated roles
      default: "client",
    },
    languages: {
      type: String, // Assuming comma-separated strings
    },
    profilePic: {
      type: String, // URL or file path
      default: "default-profile-pic-url.jpg", // Optional default image
    },
    location: {
      type: { type: String, default: "Point" }, // GeoJSON type
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    position: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    dishCatalogue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DishModel",
      },
    ],
    experiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExperienceModel",
      },
    ],
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CertificationModel",
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Index for location-based queries
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;

