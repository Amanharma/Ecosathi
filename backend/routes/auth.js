// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // determine role based on email
    let role = "user";
    if (email.endsWith("@Eco.com")) role = "admin";
    else if (email.endsWith("@dev.com")) role = "superadmin";

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      walletAddress: walletAddress || null,
      tokens: 100,
      rewards: 0,
      role, // set role dynamically
    });

    await user.save();

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
