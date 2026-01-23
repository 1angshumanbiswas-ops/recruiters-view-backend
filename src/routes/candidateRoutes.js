const express = require("express");
const router = express.Router();
const { uploadCV, getMyCVs, deleteCV } = require("../controllers/candidateController");
const authCandidate = require("../middleware/authCandidate");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload-cv", authCandidate, upload.single("cv"), uploadCV);
router.get("/my-cvs", authCandidate, getMyCVs);
router.delete("/delete-cv/:id", authCandidate, deleteCV);

module.exports = router;