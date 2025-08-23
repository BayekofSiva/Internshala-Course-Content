// mkdir-server/routes/test.js
const express = require('express');
const router = express.Router();

// Test route to check if server is working
router.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

module.exports = router;