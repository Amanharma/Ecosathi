import mongoose from "mongoose";

async function connectDB() {
  try {
    const mongoURI =
      "mongodb+srv://Shashwat:shashwat1234567890@cluster0.lglnalp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;
