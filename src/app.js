require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// ===== Middleware =====
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ===== Health Check =====
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ===== Recruiter Routes =====
const recruiterRouter = express.Router();

// Example recruiter model (inline for now)
const recruiterSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  createdAt: { type: Date, default: Date.now }
});
const Recruiter = mongoose.model('Recruiter', recruiterSchema);

// Create recruiter
recruiterRouter.post('/', async (req, res) => {
  try {
    const recruiter = new Recruiter(req.body);
    await recruiter.save();
    res.status(201).json(recruiter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all recruiters
recruiterRouter.get('/', async (_req, res) => {
  const recruiters = await Recruiter.find();
  res.json(recruiters);
});

app.use('/api/recruiter', recruiterRouter);

// ===== Visits Routes =====
const visitRouter = express.Router();

const visitSchema = new mongoose.Schema({
  page: String,
  timestamp: { type: Date, default: Date.now }
});
const Visit = mongoose.model('Visit', visitSchema);

visitRouter.post('/', async (req, res) => {
  try {
    const visit = new Visit(req.body);
    await visit.save();
    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

visitRouter.get('/', async (_req, res) => {
  const visits = await Visit.find();
  res.json(visits);
});

app.use('/api/visits', visitRouter);

// ===== Resume Routes =====
const resumeRouter = express.Router();

const resumeSchema = new mongoose.Schema({
  candidateName: String,
  resumeLink: String,
  uploadedAt: { type: Date, default: Date.now }
});
const Resume = mongoose.model('Resume', resumeSchema);

resumeRouter.post('/', async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

resumeRouter.get('/', async (_req, res) => {
  const resumes = await Resume.find();
  res.json(resumes);
});

app.use('/api/resume', resumeRouter);

// ===== Database Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Start Server =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));