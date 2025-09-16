import express from "express";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------- SUPERADMIN DASHBOARD ----------------
router.get("/superadmin-dashboard", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied. Superadmin only." });

    const admins = await User.find({ role: "admin" }).select("name email assignedIssue");
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

// ---------------- GET ALL USERS ----------------
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied" });

    const users = await User.find({ role: "user" }).select("-password -tokens -rewards");
    res.status(200).json({ msg: "All users", users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- DELETE A COMPLAINT ----------------
router.delete("/complaint/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied" });

    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    res.status(200).json({ msg: "Complaint deleted successfully ✅", complaint });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- UPDATE COMPLAINT STATUS ----------------
router.put("/complaint/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied" });

    const { status } = req.body;
    if (!["pending", "in-progress", "resolved"].includes(status)) return res.status(400).json({ msg: "Invalid status" });

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    res.status(200).json({ msg: "Complaint status updated ✅", complaint });
  } catch (error) {
    console.error("Update complaint status error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET ALL ADMINS ----------------
router.get("/admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied" });

    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json({ msg: "All admins", admins });
  } catch (error) {
    console.error("Get all admins error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- DELETE ADMIN ----------------
router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied" });

    const admin = await User.findOneAndDelete({ _id: req.params.id, role: "admin" });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    res.status(200).json({ msg: "Admin deleted successfully ✅", admin });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
