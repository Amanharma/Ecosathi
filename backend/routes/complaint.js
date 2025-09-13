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
    const { issueType, description, address, longitude, latitude, priority } =
      req.body;

    // ✅ Validation
    if (!issueType || !description) {
      return res
        .status(400)
        .json({ msg: "issueType and description are required" });
    }

    // ✅ Handle location if provided (undefined instead of null)
    let location = undefined;
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

    // ✅ Handle image upload with proper error handling and cleanup
    let imageUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "complaints",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;

        // ✅ Clean up temporary file after successful upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);

        // ✅ Clean up temporary file even if upload fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        // Continue without image rather than failing completely
        console.log("⚠️ Continuing complaint creation without image");
      }
    }

    // ✅ Create complaint with all fields
    const complaint = new Complaint({
      user: req.user.id,
      issueType,
      description,
      address: address || undefined, // ✅ Handle optional address
      location,
      image: imageUrl,
      priority: priority || "medium", // ✅ Handle priority with default
    });

    await complaint.save();

    res.status(201).json({
      msg: "Complaint registered successfully ✅",
      complaint,
    });
  } catch (error) {
    console.error("❌ Complaint creation error:", error);

    // ✅ Clean up temporary file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
