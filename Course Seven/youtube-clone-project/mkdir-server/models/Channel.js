const mongoose = require('mongoose');

/**
 * Channel Schema
 *
 * Each channel is owned by a user and can contain many videos.  Channels keep
 * track of their name, owner, description and optional banner image.  A
 * subscriber count is stored for extensibility even though we don't implement
 * subscribing in this assignment.  The `videos` array contains references to
 * the Video documents that belong to this channel.
 */
const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  channelBanner: {
    type: String,
    default: ''
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Channel', channelSchema);