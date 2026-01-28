const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  identifier: String, // email or mobile
  role: String,       // recruiter or candidate
  action: String,     // e.g., "register", "upload_cv", "view_cv"
  target: String,     // optional: candidate/recruiter email
  metadata: Object,   // optional: extra info
  timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", activitySchema);

// POST /api/activity/log
router.post("/log", async (req, res) => {
  const { identifier, role, action, target, metadata } = req.body;

  try {
    const activity = new Activity({ identifier, role, action, target, metadata });
    await activity.save();
    res.status(201).json({ message: "Activity logged successfully." });
  } catch (err) {
    console.error("❌ Activity log error:", err);
    res.status(500).json({ error: "Failed to log activity." });
  }
});

module.exports = router;