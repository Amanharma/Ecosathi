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

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      walletAddress: walletAddress || null, // optional
      tokens: 100, // 🪙 default tokens
      rewards: 0
    });

    await user.save();

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // remove password from response
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: userData
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

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // remove password from response
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
