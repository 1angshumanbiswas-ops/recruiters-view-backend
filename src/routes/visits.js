const express = require("express");
const router = express.Router();
const visitsController = require("../controllers/visitsController");

// GET /api/recruiters/visits?period=week|month|quarter
router.get("/visits", visitsController.getRecruiterVisits);

module.exports = router;