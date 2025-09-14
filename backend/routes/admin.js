// routes/admin.js
import express from "express";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Superadmin view: List all admins + their assigned issue + complaints
router.get("/superadmin-dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ msg: "Access denied. Superadmin only." });
    }

    // Get all admins
    const admins = await User.find({ role: "admin" }).select("name email assignedIssue");

    // For each admin, get complaints related to their assigned issue
    const dashboardData = await Promise.all(
      admins.map(async (admin) => {
        let complaints = [];
        if (admin.assignedIssue) {
          complaints = await Complaint.find({ issueType: admin.assignedIssue }).sort({ createdAt: -1 });
        }
        return {
          adminId: admin._id,
          name: admin.name,
          email: admin.email,
          assignedIssue: admin.assignedIssue,
          complaints
        };
      })
    );

    res.status(200).json({ msg: "Superadmin Dashboard", data: dashboardData });
  } catch (error) {
    console.error("Superadmin dashboard error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
