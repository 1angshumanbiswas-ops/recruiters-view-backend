const mongoose = require("mongoose");

const recruiterVisitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, default: "NA" }, // fallback if not provided
  loginMethod: { type: String, enum: ["email", "mobile"], default: "mobile" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RecruiterVisit", recruiterVisitSchema);