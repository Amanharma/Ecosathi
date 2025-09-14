// frontend/client/server/auth.ts
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// User Model (moved from backend)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  walletAddress: { type: String, default: null },
  tokens: { type: Number, default: 0, min: 0 },
  rewards: { type: Number, default: 0, min: 0 },
  assignedIssue: { type: String, default: null }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// MongoDB Connection
async function connectDB() {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/civic-auth"; // Your MongoDB URI
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected: civic-auth");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

// Initialize DB connection
connectDB();

const router = express.Router();

// JWT Secret (you should move this to environment variable)
const JWT_SECRET = "supersecretkey123";

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("\n=== REGISTRATION DEBUG ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    if (!name || !email || !password) {
      console.log("❌ Missing fields validation failed");
      return res.status(400).json({ msg: "All fields are required" });
    }

    console.log("🔍 Searching for existing user...");
    let user = await User.findOne({ email });
    console.log("Existing user found:", user ? "YES" : "NO");
    
    if (user) {
      console.log("❌ User exists");
      return res.status(400).json({ msg: "User already exists" });
    }

    // Auto-assign role
    let role = "user";
    if (email.endsWith("@Eco.com")) role = "admin";
    if (email.endsWith("@dev.com")) role = "superadmin";
    console.log("👤 Assigned role:", role);

    // Hash password
    console.log("🔒 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log("👤 Creating user object...");
    user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role
    });

    console.log("💾 Saving user to database...");
    await user.save();
    console.log("✅ User saved successfully!");

    const response = {
      msg: "User registered successfully ✅",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };

    res.status(201).json(response);

  } catch (error) {
    console.error("\n❌ REGISTRATION ERROR:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Email already exists (duplicate key)" });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        msg: "Validation failed", 
        errors: validationErrors 
      });
    }

    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n=== LOGIN DEBUG ===");
    console.log("Email:", `"${email}"`);

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for login");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful");
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

export default router;