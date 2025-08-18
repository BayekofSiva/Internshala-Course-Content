const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies the presence and validity of a JWT in the Authorization header.  
 * If valid, attaches the corresponding user to req.user. Otherwise,
 * returns a 401 Unauthorized response.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      // Attach user (excluding password) to request
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  return res.status(401).json({ message: 'No token provided' });
}

module.exports = authMiddleware;