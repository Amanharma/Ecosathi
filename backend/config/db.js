// backend/config/db.js
import mongoose from "mongoose";

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI; // ✅ pick from .env
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

export default connectDB;
