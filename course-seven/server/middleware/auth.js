const User = require('../models/User');

/**
 * Middleware to check if the user is authenticated.  Relies on express-session.
 * If the session contains a userId then the corresponding user is loaded
 * from MongoDB and attached to req.user.  Otherwise a 401 error is returned.
 */
async function isAuthenticated(req, res, next) {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid session' });
      }
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { isAuthenticated };