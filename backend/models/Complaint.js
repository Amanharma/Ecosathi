import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, default: uuidv4 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueType: { type: String, required: true, enum: ["road", "waste", "water", "electricity", "other"] },
  description: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  image: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

complaintSchema.index({ location: "2dsphere" });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
