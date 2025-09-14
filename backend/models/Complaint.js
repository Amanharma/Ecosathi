import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    image: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    complaintId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// ✅ Force collection name = "complaints"
export default mongoose.model("Complaint", complaintSchema, "complaints");
