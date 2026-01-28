const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit");

// POST /api/recruiters/track-visit
router.post("/track-visit", async (req, res) => {
  const { recruiterEmail, company } = req.body;

  if (!recruiterEmail) {
    return res.status(400).json({ error: "Recruiter email is required" });
  }

  try {
    const visit = new Visit({
      recruiterEmail,
      company: company || "NA"
    });

    await visit.save();
    console.log("✅ Visit tracked:", recruiterEmail, company);
    res.json({ message: "Visit tracked successfully" });
  } catch (err) {
    console.error("❌ Visit tracking error:", err);
    res.status(500).json({ error: "Failed to track visit" });
  }
});

module.exports = router;