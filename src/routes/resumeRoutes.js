const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Resume = require("../models/Resume");
const authRecruiter = require("../middleware/authRecruiter");

// Storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Upload resume (admin only)
router.post("/upload", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const resume = new Resume({
      title: req.body.title || "Untitled Resume",
      fileName: req.file.filename
    });

    await resume.save();
    res.json({ message: "Resume uploaded successfully", resume });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

// List resumes (protected)
router.get("/", authRecruiter, async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// View resume by ID (protected)
router.get("/:id/view", authRecruiter, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.sendFile(path.resolve("uploads/" + resume.fileName));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

// Delete resume by ID (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

module.exports = router;