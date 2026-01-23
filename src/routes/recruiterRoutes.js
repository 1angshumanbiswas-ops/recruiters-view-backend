const express = require("express");
const router = express.Router();
const RecruiterVisit = require("../models/RecruiterVisit");

// GET all recruiter visits
router.get("/", async (req, res) => {
  try {
    const visits = await RecruiterVisit.find();
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recruiter visits" });
  }
});

// GET a recruiter visit by ID
router.get("/:id", async (req, res) => {
  try {
    const visit = await RecruiterVisit.findById(req.params.id);
    if (!visit) return res.status(404).json({ error: "Recruiter visit not found" });
    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recruiter visit" });
  }
});

// DELETE a recruiter visit by ID
router.delete("/:id", async (req, res) => {
  try {
    await RecruiterVisit.findByIdAndDelete(req.params.id);
    res.json({ message: "Recruiter visit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recruiter visit" });
  }
});

module.exports = router;