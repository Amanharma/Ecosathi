import express from "express";
import { v4 as uuidv4 } from "uuid";
import Task from "../models/Task.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------- CREATE TASK ----------------
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, adminId } = req.body;
    if (!title || !description || !adminId) return res.status(400).json({ msg: "All fields required" });

    if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Access denied ❌ Only Superadmins can assign tasks" });

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") return res.status(400).json({ msg: "Invalid admin ID ❌" });

    const task = new Task({
      taskId: uuidv4(),
      title,
      description,
      assignedTo: adminId,
      createdBy: req.user.id
    });

    await task.save();
    res.status(201).json({ msg: "Task assigned ✅", task });
  } catch (error) {
    console.error("❌ Task creation error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- GET TASKS FOR ADMIN ----------------
router.get("/assigned", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied ❌ Only admins can view tasks" });

    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ---------------- UPDATE TASK STATUS ----------------
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied ❌ Only admins can update tasks" });

    const { status } = req.body;
    if (!["pending", "in-progress", "completed"].includes(status)) return res.status(400).json({ msg: "Invalid status ❌" });

    const task = await Task.findOneAndUpdate({ _id: req.params.id, assignedTo: req.user.id }, { status }, { new: true });
    if (!task) return res.status(404).json({ msg: "Task not found ❌" });

    res.json({ msg: "Task updated ✅", task });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default router;
