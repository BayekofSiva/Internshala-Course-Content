const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      // Check if username already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      // Create user
      user = await User.create({ username, password: hashed });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a JWT
 * @access  Public
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const payload = { id: user._id };
      // Sign token with secret and 2 hour expiration
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '2h' });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;