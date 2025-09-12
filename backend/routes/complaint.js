// routes/complaints.js
import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import { cloudinary } from "../utils/cloudinary.js";

import authMiddleware from "../middleware/authMiddleware.js"; // ✅ protect routes

const router = express.Router();

// Multer for temporary uploads
const upload = multer({ dest: "uploads/" });

// ---------------- CREATE COMPLAINT ----------------
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { issueType, description, address, longitude, latitude } = req.body;

    // ✅ Validation
    if (!issueType || !description) {
      return res.status(400).json({ msg: "issueType and description are required" });
    }

    // ✅ Handle location if provided
    let location = null;
    if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (!isNaN(lon) && !isNaN(lat)) {
        location = {
          type: "Point",
          coordinates: [lon, lat],
        };
      }
    }

    // ✅ Handle image upload
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "complaints",
      });
      imageUrl = result.secure_url;
    }

    // ✅ Create complaint
    const complaint = new Complaint({
      user: req.user.id, // from authMiddleware
      issueType,
      description,
      address,
      location,
      image: imageUrl,
    });

    await complaint.save();

    res.status(201).json({
      msg: "Complaint registered successfully ✅",
      complaint,
    });

  } catch (error) {
    console.error("❌ Complaint creation error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
