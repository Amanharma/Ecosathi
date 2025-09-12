import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, default: () => nanoid() },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String }, // User-typed address
  location: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: undefined }, 
},

  image: { type: String },
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

complaintSchema.index({ location: "2dsphere" });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
