const mongoose = require('mongoose');

/**
 * Comment Schema
 *
 * Comments belong to a video and a user.  We record the comment text and
 * timestamp so that comments can be displayed in chronological order.  The
 * user reference allows us to populate the username/avatar when returning
 * comments to the front‑end.
 */
const commentSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);