import express from "express";
import multer from "multer";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { cloudinary } from "../utils/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ---------------- CREATE COMPLAINT ----------------
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { issueType, description, address, longitude, latitude, priority } = req.body;
    if (!issueType || !description) return res.status(400).json({ msg: "issueType and description are required" });

    let location;
    if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (!isNaN(lon) && !isNaN(lat)) location = { type: "Point", coordinates: [lon, lat] };
    }

    let imageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "complaints", resource_type: "auto" });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
      } finally {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    }

    const complaint = new Complaint({
      user: req.user.id,
      issueType,
      description,
      address: address || undefined,
      location,
      image: imageUrl,
      priority: priority || "medium"
    });

    await complaint.save();
    res.status(201).json({ msg: "Complaint registered successfully ✅", complaint });
  } catch (error) {
    console.error("❌ Complaint creation error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET MY COMPLAINTS ----------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const { issueType, status, priority } = req.query;
    const filter = { user: req.user.id };
    if (issueType) filter.issueType = issueType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ msg: "Your complaints", complaints });
  } catch (error) {
    console.error("❌ Get my complaints error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET COMPLAINTS FOR ADMIN/SUPERADMIN ----------------
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const { issueType, status, priority } = req.query;
    const user = await User.findById(req.user.id);

    let filter = {};
    if (user.role === "user") filter.user = req.user.id;
    else if (user.role === "admin") {
      if (!user.assignedIssue) return res.status(400).json({ msg: "Admin has no assigned issue" });
      filter.issueType = user.assignedIssue;
    }

    if (issueType) filter.issueType = issueType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ msg: "Filtered complaints based on role", complaints });
  } catch (error) {
    console.error("❌ Get complaints error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET ADMIN ASSIGNMENTS (SUPERADMIN VIEW) ----------------
router.get("/admin-assignments", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "superadmin") return res.status(403).json({ msg: "Access denied: superadmin only" });

    const admins = await User.find({ role: "admin" });
    const assignments = [];
    for (const admin of admins) {
      const adminComplaints = await Complaint.find({ issueType: admin.assignedIssue });
      assignments.push({
        adminId: admin._id,
        email: admin.email,
        assignedIssue: admin.assignedIssue,
        complaints: adminComplaints
      });
    }

    res.status(200).json({ msg: "Superadmin view: admin assignments", assignments });
  } catch (error) {
    console.error("❌ Get admin assignments error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
