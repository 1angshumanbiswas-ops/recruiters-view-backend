// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

/* ---------------- Recruiter Schema + Routes ---------------- */
const recruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  createdAt: { type: Date, default: Date.now }
});
const Recruiter = mongoose.model("Recruiter", recruiterSchema);

// Register recruiter
app.post("/api/recruiters/register", async (req, res) => {
  const { name, email, phone, company } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await Recruiter.findOne({ email });
    if (existing) return res.json({ message: "Recruiter already registered" });

    const recruiter = new Recruiter({ name, email, phone, company });
    await recruiter.save();
    res.json({ message: "Recruiter registered successfully" });
  } catch (err) {
    console.error("❌ Recruiter registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Superadmin recruiter data
app.get("/api/superadmin/recruiters", async (req, res) => {
  const requester = req.query.email;
  const superadminEmail = "1angshuman.biswas@gmail.com";

  if (requester !== superadminEmail) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const recruiters = await Recruiter.find().sort({ createdAt: -1 });
    res.json({ recruiters });
  } catch (err) {
    console.error("❌ Failed to fetch recruiter data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- Candidate Schema + CV Upload/Delete ---------------- */
const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  cvs: [
    {
      filename: String,
      originalname: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
});
const Candidate = mongoose.model("Candidate", candidateSchema);

const upload = multer({ dest: "uploads/" });

// Upload CV
app.post("/api/candidates/upload-cv", upload.single("cv"), async (req, res) => {
  const { name, email } = req.body;
  const { filename, originalname } = req.file;

  try {
    let candidate = await Candidate.findOne({ email });
    if (!candidate) {
      candidate = new Candidate({ name, email, cvs: [] });
    }

    candidate.cvs.push({ filename, originalname });
    await candidate.save();
    res.json({ message: "CV uploaded successfully" });
  } catch (err) {
    console.error("❌ CV upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all candidates
app.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    console.error("❌ Fetch candidates error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete CV
app.delete("/admin/delete-cv/:cvId", async (req, res) => {
  const { cvId } = req.params;

  try {
    const candidate = await Candidate.findOne({ "cvs._id": cvId });
    if (!candidate) return res.status(404).json({ error: "CV not found" });

    candidate.cvs = candidate.cvs.filter(cv => cv._id.toString() !== cvId);
    await candidate.save();
    res.json({ message: "CV deleted successfully" });
  } catch (err) {
    console.error("❌ CV delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- Recruiter Visit Tracking ---------------- */
const visitSchema = new mongoose.Schema({
  recruiterEmail: { type: String, required: true },
  company: { type: String, default: "NA" },
  timestamp: { type: Date, default: Date.now }
});
const Visit = mongoose.model("Visit", visitSchema);

// Track recruiter visit
app.post("/api/recruiters/track-visit", async (req, res) => {
  const { recruiterEmail, company } = req.body;
  if (!recruiterEmail) return res.status(400).json({ error: "Recruiter email is required" });

  try {
    const visit = new Visit({ recruiterEmail, company: company || "NA" });
    await visit.save();
    res.json({ message: "Visit tracked successfully" });
  } catch (err) {
    console.error("❌ Visit tracking error:", err);
    res.status(500).json({ error: "Failed to track visit" });
  }
});

// Get recruiter visits analytics
app.get("/api/recruiters/visits", async (req, res) => {
  const { period = "week" } = req.query;
  const now = new Date();
  let startDate;
  if (period === "month") startDate = new Date(now.setMonth(now.getMonth() - 1));
  else if (period === "quarter") startDate = new Date(now.setMonth(now.getMonth() - 3));
  else startDate = new Date(now.setDate(now.getDate() - 7));

  try {
    const visits = await Visit.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$recruiterEmail",
          count: { $sum: 1 },
          company: { $first: "$company" }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json({ period, visits });
  } catch (err) {
    console.error("❌ Visit analytics error:", err);
    res.status(500).json({ error: "Failed to fetch visit analytics" });
  }
});

/* ---------------- Root Endpoint ---------------- */
app.get("/", (req, res) => {
  res.send("Recruiter Views Backend API is running...");
});

/* ---------------- Port ---------------- */
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});