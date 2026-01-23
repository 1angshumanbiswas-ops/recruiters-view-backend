const mongoose = require("mongoose");

const recruiterVisitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RecruiterVisit", recruiterVisitSchema);