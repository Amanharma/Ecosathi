import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Auto-assign role
    let role = "user";
    if (email.endsWith("@Eco.com")) role = "admin";
    if (email.endsWith("@dev.com")) role = "superadmin";

    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      msg: "User registered successfully ✅",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      msg: "Login successful ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- FORGOT PASSWORD ----------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    res.status(200).json({ msg: "Password reset token generated ✅", resetToken: token });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post("/resetpassword", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ msg: "Token and new password are required" });

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = newPassword; // Will be hashed automatically via pre-save hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ msg: "Password reset successfully ✅" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
