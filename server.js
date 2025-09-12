import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaint.js";

dotenv.config(); // Load env variables early

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect Database first
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Civic-Auth API is running...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

