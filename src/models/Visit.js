const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter", // links to Recruiter profile
    required: false
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pageVisited: { type: String, default: "login" }, // e.g., login, dashboard, resume
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visit", visitSchema);