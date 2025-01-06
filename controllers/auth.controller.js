import { redis } from "../lib/redis.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m", // Access token expires in 15 minutes
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d", // Refresh token expires in 7 days
	});

	return { accessToken, refreshToken };
};

// Store refresh token in Redis with a 7-day expiration
const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks
		secure: process.env.NODE_ENV === "production", // secure cookie in production
		sameSite: "strict", // prevents CSRF attacks
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks
		secure: process.env.NODE_ENV === "production", // secure cookie in production
		sameSite: "strict", // prevents CSRF attacks
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

//SignUp Function
export const signup = async (req, res) => {
	const { email, password, name, role, languages, latitude, longitude } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Ensure coordinates are valid
		if (!latitude || !longitude) {
			return res.status(400).json({ message: "Invalid location data. Latitude and Longitude are required." });
		}

		// Convert latitude and longitude to numbers
		const lat = parseFloat(latitude);
		const lng = parseFloat(longitude);

		if (isNaN(lat) || isNaN(lng)) {
			return res.status(400).json({ message: "Latitude and Longitude must be valid numbers." });
		}

		// Create a new user with the provided data
		const user = await User.create({
			name,
			email,
			password,
			role,
			languages,
			location: {
				type: "Point", // GeoJSON type
				coordinates: [lng, lat], // GeoJSON coordinates
			},
			position: {
				longitude: lng, // Store as number
				latitude: lat, // Store as number
			},
			profilePic: "default-profile-pic-url.jpg", // Default profile picture
			dishCatalogue: [],
			experiences: [],
			certifications: [],
			chats: [],
		});

		// Generate tokens
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		// Set cookies
		setCookies(res, accessToken, refreshToken);

		// Send response with the full user data
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			languages: user.languages,
			location: user.location,
			position: user.position,
			profilePic: user.profilePic,
			dishCatalogue: user.dishCatalogue,
			experiences: user.experiences,
			certifications: user.certifications,
			chats: user.chats,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};


// Login function
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		// Check if user exists and compare password
		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			// Send full user data as response
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				languages: user.languages,
				location: user.location,
				position: user.position,
				profilePic: user.profilePic,
				dishCatalogue: user.dishCatalogue,
				experiences: user.experiences,
				certifications: user.certifications,
				chats: user.chats,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};


// Logout function
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Reset User Password
export const resetPassword = async (req, res) => {
	try {
		// Destructure the data from the request body
		const { name, email, newPassword } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the name matches the user's name (optional security step)
		if (user.name !== name) {
			return res.status(400).json({ message: "Name does not match the record." });
		}

		// Update the user's password
		user.password = newPassword;

		// Save the updated user
		await user.save();

		// Send response
		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		console.error("Error resetting password:", error.message);
		res.status(500).json({ message: error.message });
	}
};


// Refresh access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get user profile details
export const getProfile = async (req, res) => {
  try {
    const { userID } = req.query;  // Extract userID from query parameters

    // Check if userID is provided
    if (!userID) {
      return res.status(400).json({ message: "UserID is required" });
    }

    // Fetch user details from the database using the userID
    const user = await User.findById(userID);

    // If user doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the user profile details
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      languages: user.languages,
      location: user.location,
      position: user.position,
      profilePic: user.profilePic,
      dishCatalogue: user.dishCatalogue,
      experiences: user.experiences,
      certifications: user.certifications,
      chats: user.chats,
    });
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// User Profile update
/* export const updateProfile = async (req, res) => {
  try {
    // Use the logged-in user's ID from req.user (set by protectRoute middleware)
    const userID = req.user._id;

    // Find the user by userID
    const user = await User.findById(userID);

    // If the user doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user with the provided data
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          role: req.body.role || user.role,
          languages: req.body.languages || user.languages,
          location: req.body.location || user.location,
          position: req.body.position || user.position,
          profilePic: req.body.profilePic || user.profilePic, // Optional: If you want to allow profile picture update
          dishCatalogue: req.body.dishCatalogue || user.dishCatalogue,
          experiences: req.body.experiences || user.experiences,
          certifications: req.body.certifications || user.certifications,
          chats: req.body.chats || user.chats,
        }
      },
      { new: true }  // Return the updated user object
    );

    // Send the updated user details as a response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: error.message });
  }
};*/

