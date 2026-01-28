const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Candidate OTP request
router.post("/send-otp", (req, res) => {
  const { mobile } = req.body;
  console.log("Candidate OTP requested for:", mobile);
  res.json({ message: "OTP sent successfully" });
});

// Candidate OTP verification
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  console.log("Candidate OTP verification:", email, otp);

  if (otp === "123456") {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

module.exports = router;