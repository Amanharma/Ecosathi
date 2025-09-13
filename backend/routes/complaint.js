import express from "express";
import multer from "multer";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import { cloudinary } from "../utils/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ---------------- CREATE COMPLAINT ----------------
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { issueType, description, address, longitude, latitude, priority } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({ msg: "issueType and description are required" });
    }

    let location;
    if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (!isNaN(lon) && !isNaN(lat)) {
        location = { type: "Point", coordinates: [lon, lat] };
      }
    }

    let imageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "complaints",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        console.log("⚠️ Continuing complaint creation without image");
      } finally {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    }

    const complaint = new Complaint({
      user: req.user.id, // comes from authMiddleware
      issueType,
      description,
      address: address || undefined,
      location,
      image: imageUrl,
      priority: priority || "medium",
    });

    await complaint.save();

    res.status(201).json({ msg: "Complaint registered successfully ✅", complaint });
  } catch (error) {
    console.error("❌ Complaint creation error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET COMPLAINTS FOR LOGGED-IN USER ----------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const { issueType, status, priority } = req.query; // optional filters

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

// ---------------- GET COMPLAINTS FOR A SPECIFIC USER ----------------
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { issueType, status, priority } = req.query; // optional filters

    const filter = { user: userId };
    if (issueType) filter.issueType = issueType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ msg: `Complaints for user ${userId}`, complaints });
  } catch (error) {
    console.error("❌ Get user complaints error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET ALL COMPLAINTS ----------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { issueType, status, priority } = req.query; // optional filters
    const filter = {};
    if (issueType) filter.issueType = issueType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ msg: "All complaints", complaints });
  } catch (error) {
    console.error("❌ Get all complaints error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
