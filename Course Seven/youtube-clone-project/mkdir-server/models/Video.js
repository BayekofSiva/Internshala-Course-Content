const mongoose = require('mongoose');

/**
 * Video Schema
 *
 * Each video belongs to a channel and has an uploader (user).  The schema
 * stores essential metadata such as the title, URL, thumbnail, description,
 * category and duration.  The views, likes and dislikes counters default to
 * zero.  We record the upload date for ordering videos and use timestamps to
 * capture when a document was created or updated.
 */
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'All'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: '0:00'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);