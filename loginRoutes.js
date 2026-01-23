const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Recruiter = require("./src/models/Recruiter"); // adjust path if needed

// Debug route
router.get("/debug", async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.json(recruiters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/email", async (req, res) => {
  const { email, password } = req.body;

  try {
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Recruiter not found" });
    }

    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: recruiter._id, email: recruiter.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;