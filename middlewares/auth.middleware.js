// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// Protect route for authenticated users
export const protectRoute = async (req, res, next) => {
    try {
        // Get the access token from cookies
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Access token expired" });
        }
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
    }
};

// Protect route for role-based access (e.g., for admins or chefs)
export const roleBasedAccess = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            return next(); // User has the correct role, proceed
        } else {
            return res.status(403).json({ message: "Access denied - Insufficient permissions" });
        }
    };
};

// Middleware to authenticate a user based on the Bearer token in the Authorization header
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No access token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("Error in authenticate middleware", error.message);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

