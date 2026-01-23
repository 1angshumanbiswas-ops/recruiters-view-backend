const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const authAdmin = require("../middleware/authAdmin");

// 🔐 Admin-only recruiter summary
router.get("/recruiter-summary", authAdmin, async (req, res) => {
  try {
    const recruiters = await Recruiter.find({}, "name email phone lastLogin");

    res.json({
      count: recruiters.length,
      recruiters
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recruiter summary" });
  }
});

module.exports = router;