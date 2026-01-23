const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "recruiter"
    },
    phone: {
      type: String,
      default: null
    },
    otpCode: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: "Recruiters" // 👈 ensures it matches your Atlas collection
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;