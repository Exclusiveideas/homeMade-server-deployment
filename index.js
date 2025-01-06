const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require('./lib/db.js');

const authRoutes = require("./routes/authRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const chefsRoutes = require("./routes/chefsRoutes.js");
const dishRoutes = require("./routes/dishRoutes.js");
const experienceRoutes = require("./routes/experienceRoutes.js");
const certificationRoutes = require("./routes/certificationRoutes.js");
const chatRoomRoutes = require("./routes/chatRoomRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*'
})); 
app.use(function(req, res, next) {
 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
  });


// Routes
app.get("/", (req, res) => {
    res.send("HomeMade Server running")
})
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chefs", chefsRoutes);
app.use("/api/dish", dishRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certification", certificationRoutes);
app.use("/api/chatRoom", chatRoomRoutes);
app.use("/api/message", messageRoutes);



// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App server is running on Port ${PORT}`) 
});