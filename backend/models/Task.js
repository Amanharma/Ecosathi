import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const taskSchema = new mongoose.Schema({
  taskId: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
