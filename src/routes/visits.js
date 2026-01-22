const express = require('express');
const router = express.Router();

// Example visits route
router.get('/', (req, res) => {
  res.json({ message: 'Visits route working!' });
});

module.exports = router;