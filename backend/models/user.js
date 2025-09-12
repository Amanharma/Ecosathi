import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  walletAddress: {
    type: String,
    default: null
  },
  tokens: {
  type: Number,
  default: 0,
  min: 0
},
rewards: {
  type: Number,
  default: 0,
  min: 0
}

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
