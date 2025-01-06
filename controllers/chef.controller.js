import Chef from "../models/chef.models.js";
import Review from "../models/review.model.js";
import User from "../models/user.models.js";
import Booking from "../models/booking.model.js";
import { uploadImage, deleteImageFromCloudinary } from "../lib/cloudinary.js";

// Logic to create chef profile
export const createChefProfile = async (req, res) => {
  try {
    const { name, bio, specialties, certificates } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    // Fetch the user's location (latitude and longitude) from the user model
    const user = await User.findById(req.user.id); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const { latitude, longitude } = user.location;

    // Check if chef profile already exists for this user
    const existingChef = await Chef.findOne({ user: req.user.id });
    if (existingChef) {
      return res.status(400).json({ error: "Chef profile already exists." });
    }

    // Upload profile picture if provided
    let profilePictureUrl = null;
    if (req.file || req.body.profilePicture) {
      const imagePath = req.file ? req.file.path : req.body.profilePicture;
      profilePictureUrl = await uploadImage(imagePath);
    }

    // Upload certificates if provided
    let certificateUrls = [];
    if (certificates && Array.isArray(certificates)) {
      for (const certificate of certificates) {
        const uploadedUrl = await uploadImage(certificate);
        certificateUrls.push(uploadedUrl);
      }
    }

    // Create new chef profile
    const newChef = new Chef({
      user: req.user.id,
      name,
      bio,
      specialties: Array.isArray(specialties)
        ? specialties
        : specialties.split(","),
      profilePicture: profilePictureUrl,
      certificates: certificateUrls,
      location: { latitude, longitude },
    });

    // Save to database
    await newChef.save();

    return res.status(201).json({
      message: "Chef profile created successfully.",
      chef: newChef,
    });
  } catch (error) {
    console.error("Error creating chef profile:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

// Logic to fetch the logged-in chef's profile
export const getChefProfile = async (req, res) => {
  try {
    const chefProfile = await Chef.findOne({ user: req.user.id });

    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found." });
    }

    // Fetch the user's location (latitude, longitude) from the User model
    const user = await User.findById(req.user.id);
    if (!user || !user.location) {
      return res.status(404).json({ error: "User location not found." });
    }
    const { latitude, longitude } = user.location;


    const response = {
      name: chefProfile.name || "Name not provided",
      bio: chefProfile.bio || "No bio available",
      specialties: chefProfile.specialties || [],
      profilePicture:
        chefProfile.profilePicture ||
        "https://res.cloudinary.com/<your-cloud-name>/image/upload/v1/homeMade/default-profile.png",
      certificates: chefProfile.certificates || [],
      location: { latitude, longitude },
    
    };

    return res.status(200).json({
      message: "Profile fetched successfully.",
      profile: response,
    });
  } catch (error) {
    console.error("Error fetching chef profile:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

// Logic to update chef profile
export const updateChefProfile = async (req, res) => {
  try {
    const { name, bio, specialties } = req.body;

    const chefProfile = await Chef.findOne({ user: req.user.id });
    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found." });
    }

    let profilePictureUrl = chefProfile.profilePicture;
    if (req.file || req.body.profilePicture) {
      try {
        if (chefProfile.profilePicture) {
          await deleteImageFromCloudinary(chefProfile.profilePicture);
        }
        const imagePath = req.file ? req.file.path : req.body.profilePicture;
        profilePictureUrl = await uploadImage(imagePath);
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Image upload failed: " + error.message });
      }
    }

    chefProfile.name = name || chefProfile.name;
    chefProfile.bio = bio || chefProfile.bio;
    chefProfile.specialties = Array.isArray(specialties)
      ? specialties
      : specialties.split(",");
    chefProfile.profilePicture = profilePictureUrl;

    // Save the updated profile
    await chefProfile.save();

    return res.status(200).json({
      message: "Chef profile updated successfully.",
      profile: chefProfile,
    });
  } catch (error) {
    console.error("Error updating chef profile:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

export const deleteChefProfile = async (req, res) => {
  try {
    const chefProfile = await Chef.findOne({ user: req.user.id });
    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found." });
    }

    // Check if the logged-in user matches the chef profile's user
    if (chefProfile.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this profile." });
    }

    // Delete profile picture from Cloudinary if it exists
    if (chefProfile.profilePicture) {
      try {
        await deleteImageFromCloudinary(chefProfile.profilePicture);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Delete chef profile from database
    await Chef.findByIdAndDelete(chefProfile._id);

    return res
      .status(200)
      .json({ message: "Chef profile deleted successfully." });
  } catch (error) {
    console.error("Error deleting chef profile:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

// POST /chefs/:id/reviews
export const addReview = async (req, res) => {
  const { id } = req.params; // Chef ID
  const { rating, comment } = req.body; // Review details
  const userId = req.user.id; // Authenticated user ID from middleware

  try {
    // Ensure the chef exists
    const chef = await Chef.findById(id);
    if (!chef) return res.status(404).json({ message: "Chef not found." });

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({ chef: id, user: userId });
    if (existingReview)
      return res
        .status(400)
        .json({ message: "You already reviewed this chef." });

    // Validate rating
    if (rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });

    // Create and save the review
    const review = new Review({
      user: userId,
      chef: id,
      rating,
      comment,
    });
    await review.save();

    // Update chef's rating
    const reviews = await Review.find({ chef: id });
    const averageRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
    chef.averageRating = averageRating;
    await chef.save();

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review." });
  }
};

// GET /chefs/:id/reviews
export const getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ chef: id }).populate("user", "name");
    if (!reviews.length)
      return res
        .status(404)
        .json({ message: "No reviews found for this chef." });

    const averageRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    res.status(200).json({ averageRating, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews." });
  }
};

// POST /chefs/:id/bookings
export const addBooking = async (req, res) => {
  const { id } = req.params;
  const { date, time, service, specialRequests } = req.body;
  const userId = req.user.id;

  try {
    // Ensure the chef exists
    const chef = await Chef.findById(id);
    if (!chef) return res.status(404).json({ message: "Chef not found." });

    // Validate date and time
    const bookingDate = new Date(`${date}T${time}`); // Corrected line
    if (bookingDate < new Date())
      return res
        .status(400)
        .json({ message: "Booking must be in the future." });

    // Check for conflicts
    const existingBooking = await Booking.findOne({ chef: id, date, time });
    if (existingBooking)
      return res
        .status(400)
        .json({ message: "Chef is already booked for this time." });

    // Create booking
    const booking = new Booking({
      user: userId,
      chef: id,
      date,
      time,
      service,
      specialRequests,
    });
    await booking.save();

    res.status(201).json({ message: "Booking created successfully." });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking." });
  }
};

// GET /chefs/:id/bookings
export const getBookings = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await Booking.find({ chef: id }).populate("user", "name");
    if (!bookings.length)
      return res
        .status(404)
        .json({ message: "No bookings found for this chef." });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings." });
  }
};

// GET /chefs/me
export const getChefStats = async (req, res) => {
  const userId = req.user.id; // Authenticated user ID (Chef)

  try {
    // Find the chef (self)
    const chef = await Chef.findOne({ user: userId });
    if (!chef) return res.status(404).json({ message: "Chef not found." });

    // Total bookings
    const totalBookings = await Booking.countDocuments({ chef: chef._id });

    // Total reviews and average rating
    const reviews = await Review.find({ chef: chef._id });
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    // Return chef stats
    res.status(200).json({
      chef: {
        name: chef.name,
        totalBookings,
        totalReviews,
        averageRating,
        profilePicture: chef.profilePicture || "",
        specialties: chef.specialties || [],
      },
    });
  } catch (error) {
    console.error("Error fetching chef stats:", error);
    res.status(500).json({ message: "Error fetching chef stats." });
  }
};
