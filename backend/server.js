import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaint.js";
import cors from "cors";
//dotenv.config(); // Load env variables early
console.log(process.env.JWT_SECRET); // Ensure env variables are loaded

const app = express();
const PORT = 5000;

// ✅ Connect Database first
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"], // Vite default ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
