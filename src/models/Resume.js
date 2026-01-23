const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);