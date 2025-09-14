// Test database operations
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civic-auth";

console.log("🔍 Testing MongoDB connection...");
console.log("MongoDB URI:", mongoURI);

async function testDatabase() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB connected: ${conn.connection.name}`);
    
    // Check if database exists
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("📁 Collections in database:", collections.map(c => c.name));
    
    // Check users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Check complaints collection
    const complaintsCollection = db.collection('complaints');
    const complaintCount = await complaintsCollection.countDocuments();
    console.log(`📝 Complaints in database: ${complaintCount}`);
    
    // Show recent users
    if (userCount > 0) {
      const recentUsers = await usersCollection.find({}).limit(3).toArray();
      console.log("📋 Recent users:", recentUsers.map(u => ({ name: u.name, email: u.email, createdAt: u.createdAt })));
    }
    
    // Show recent complaints
    if (complaintCount > 0) {
      const recentComplaints = await complaintsCollection.find({}).limit(3).toArray();
      console.log("📋 Recent complaints:", recentComplaints.map(c => ({ issueType: c.issueType, status: c.status, createdAt: c.createdAt })));
    }
    
    await mongoose.disconnect();
    console.log("✅ Database test completed successfully!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  }
}

testDatabase();
