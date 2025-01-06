const router = require("express").Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models");

//Register
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json("Incomplete input");
    return;
  }

  // Check if the user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
});


//LOGIN
router.post("/login", async (req, res) => {
  const { email, password: loginPassword } = req.body; //why is password unused?

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email doesn't exist" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(loginPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Remove password from response
    const { password, ...others } = user._doc;

    res.status(201).json({ message: "Login successful", user: others });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});


//RESET
router.put("/reset", async (req, res) => {
  const { email, password: newPassword, name } = req.body;

  if (!newPassword || !name) {
    return res.status(400).json({ message: "Incomplete input" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    if (user.name !== name) {
      return res.status(400).json({ message: "Incorrect name provided" });
    }

    // Optional: Add password validation here
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedNewPassword },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Password updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
});

module.exports = router;
