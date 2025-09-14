// backend/debugUser.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check all users first
    const allUsers = await User.find({});
    console.log(`\n📋 Total users in database: ${allUsers.length}`);

    if (allUsers.length > 0) {
      console.log("\n👥 All users:");
      allUsers.forEach((user, index) => {
        console.log(
          `${index + 1}. "${user.email}" - ${user.name} (${user.role})`
        );
      });
    }

    // Search for variations of the email
    const searchEmails = [
      "lonents@gmail.com",
      "LONENTS@GMAIL.COM",
      " lonents@gmail.com ",
      "lonents@gmail.com ",
      " lonents@gmail.com",
    ];

    console.log("\n🔍 Searching for email variations:");
    for (const email of searchEmails) {
      const user = await User.findOne({ email: email });
      console.log(`   "${email}" -> ${user ? "✅ FOUND" : "❌ Not found"}`);
    }

    // Search using regex (case insensitive)
    const regexUser = await User.findOne({
      email: { $regex: /^lonents@gmail\.com$/i },
    });
    console.log(
      `\n🔎 Case-insensitive search: ${regexUser ? "✅ FOUND" : "❌ Not found"}`
    );

    // Check for any email containing "lonents"
    const partialUser = await User.findOne({
      email: { $regex: /lonents/i },
    });
    console.log(
      `🔍 Partial email search: ${partialUser ? "✅ FOUND" : "❌ Not found"}`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

debugUser();
