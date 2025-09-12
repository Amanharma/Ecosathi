import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaint.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);

// DB connect
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
