const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  recruiterEmail: { type: String, required: true },
  company: { type: String, default: "NA" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visit", visitSchema);