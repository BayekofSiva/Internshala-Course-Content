const mongoose = require('mongoose');

/**
 * User model
 * Stores user authentication data.  
 * Fields:
 *  - username: Unique username for the user.
 *  - password: Hashed password for authentication.
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);