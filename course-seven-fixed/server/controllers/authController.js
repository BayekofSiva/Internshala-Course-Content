import bcrypt from 'bcryptjs';
// Fix case sensitivity of the import; the actual file is `User.js`.
import User from '../models/User.js';

/**
 * Controller for authentication related endpoints.
 * Contains logic to register a new user.
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User already exists' });
    }
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // Respond with minimal user data
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    // Duplicate key error (e.g. email already exists)
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'User already exists' });
    }
    // Unknown server error
    console.error('Registration error:', err);
    return res
      .status(500)
      .json({ message: 'Server error' });
  }
};