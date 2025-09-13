// routes/complaint.js
import express from "express";
import multer from "multer";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import { cloudinary } from "../utils/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer for temporary uploads
const upload = multer({ dest: "uploads/" });

// ---------------- CREATE COMPLAINT ----------------
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { issueType, description, address, longitude, latitude, priority } = req.body;

    // ✅ Validation
    if (!issueType || !description) {
      return res.status(400).json({ msg: "issueType and description are required" });
    }

    // ✅ Handle location properly
    let location;
    if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (!isNaN(lon) && !isNaN(lat)) {
        location = { type: "Point", coordinates: [lon, lat] };
      }
    }

    // ✅ Handle image upload
    let imageUrl = null;
    if (req.file) {
      try {
        console.log('File path received by Multer:', req.file.path);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "complaints",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        console.log("⚠️ Continuing complaint creation without image");
      } finally {
        // Always cleanup file if it exists
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    // ✅ Create complaint
    const complaint = new Complaint({
      user: req.user.id, // from authMiddleware
      issueType,
      description,
      address: address || undefined,
      location,
      image: imageUrl,
      priority: priority || "medium",
    });

    await complaint.save();

    res.status(201).json({
      msg: "Complaint registered successfully ✅",
      complaint,
    });
  } catch (error) {
    console.error("❌ Complaint creation error:", error);

    // ✅ Cleanup temp file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
