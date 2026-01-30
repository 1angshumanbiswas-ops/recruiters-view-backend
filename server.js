const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const cron = require("node-cron");

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

/* ---------------- Middleware ---------------- */
function isSuperadmin(req, res, next) {
  const email = req.query.email || req.body.email;
  if (email !== "1angshuman.biswas@gmail.com") {
    return res.status(403).json({ error: "Access denied: Superadmin only" });
  }
  next();
}

/* ---------------- Recruiter Schema + Routes ---------------- */
const recruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  createdAt: { type: Date, default: Date.now }
});
const Recruiter = mongoose.model("Recruiter", recruiterSchema);

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

app.get("/api/superadmin/recruiters", isSuperadmin, async (req, res) => {
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

app.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    console.error("❌ Fetch candidates error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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

/* ---------------- Activity Logging ---------------- */
const activitySchema = new mongoose.Schema({
  identifier: String,
  role: String,
  action: String,
  target: String,
  metadata: Object,
  timestamp: { type: Date, default: Date.now }
});
const Activity = mongoose.model("Activity", activitySchema);

app.post("/api/activity/log", async (req, res) => {
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

// Superadmin: Filter logs by date range
app.get("/api/activity/logs/filter", isSuperadmin, async (req, res) => {
  const { range, start, end } = req.query;
  let fromDate, toDate = new Date();

  if (range === "week") {
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);
  } else if (range === "month") {
    fromDate = new Date();
    fromDate.setMonth(toDate.getMonth() - 1);
  } else if (range === "custom" && start && end) {
    fromDate = new Date(start);
    toDate = new Date(end);
  } else {
    fromDate = new Date("2000-01-01");
  }

  try {
    const logs = await Activity.find({
      timestamp: { $gte: fromDate, $lte: toDate }
    }).sort({ timestamp: -1 });

    res.json({ activities: logs });
  } catch (err) {
    console.error("❌ Filter fetch failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Superadmin: Delete log by ID
app.delete("/api/activity/log/:id", isSuperadmin, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Log deleted" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Cron job: Auto-delete recruiter logs older than 3 months
cron.schedule("0 3 * * *", async () => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);

  try {
   