const Recruiter = require("../models/Recruiter");
const RecruiterVisit = require("../models/RecruiterVisit");

// Generate and send OTP (stubbed for now)
exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to recruiter record (or create new)
  let recruiter = await Recruiter.findOne({ mobile });
  if (!recruiter) {
    recruiter = new Recruiter({ mobile, otp });
  } else {
    recruiter.otp = otp;
  }
  recruiter.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
  await recruiter.save();

  // TODO: integrate SMS/email service to send OTP
  res.json({ message: "OTP sent", otp }); // show OTP for dev only
};

// Verify OTP and log in
exports.verifyOtp = async (req, res) => {
  const { mobile, otp, name, email, company } = req.body;
  const recruiter = await Recruiter.findOne({ mobile });

  if (!recruiter || recruiter.otp !== otp || recruiter.otpExpiry < Date.now()) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  // Update recruiter info if first login
  recruiter.name = recruiter.name || name;
  recruiter.email = recruiter.email || email;
  recruiter.company = recruiter.company || company || "NA";
  recruiter.lastLogin = new Date();
  recruiter.otp = null;
  recruiter.otpExpiry = null;
  await recruiter.save();

  // Track visit
  await RecruiterVisit.create({
    name: recruiter.name,
    email: recruiter.email,
    phone: recruiter.mobile,
    company: recruiter.company || "NA",
    loginMethod: "mobile"
  });

  // Return token (or bypass if superadmin)
  const token = recruiter.email === "1angshuman.biswas@gmail.com" ? null : "mock-jwt-token";
  res.json({ token, email: recruiter.email });
};