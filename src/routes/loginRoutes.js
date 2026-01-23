const express = require("express");
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/Recruiter"); // import your Recruiter model

const router = express.Router();

// POST /api/login/email
router.post("/email", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find recruiter by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    // Compare password using the model method
    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: recruiter._id, role: recruiter.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // Update last login timestamp
    recruiter.lastLogin = new Date();
    await recruiter.save();

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Debug route to list recruiters (optional, for troubleshooting)
router.get("/debug", async (req, res) => {
  try {
    const recruiters = await Recruiter.find({});
    res.json(recruiters);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;