const express = require('express');
const router = express.Router();

// Example resume route
router.get('/', (req, res) => {
  res.json({ message: 'Resume route working!' });
});

module.exports = router;