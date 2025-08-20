const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const { encrypt, decrypt } = require('../utils/encryption');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    // Save userId in session
    req.session.userId = user._id;
    // Store encrypted userId as a token for demonstration
    req.session.userToken = encrypt(user._id.toString());
    res.status(201).json({ _id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    req.session.userId = user._id;
    req.session.userToken = encrypt(user._id.toString());
    res.json({ _id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.clearCookie('connect.sid');
  return res.json({ message: 'Logged out' });
});

// Current user
router.get('/me', async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) return res.status(401).json({ message: 'Invalid session' });
      return res.json(user);
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;