const express = require('express');
const router = express.Router();

// Example recruiter route
router.get('/', (req, res) => {
  res.json({ message: 'Recruiter route working!' });
});

module.exports = router;