const express = require('express');
const Channel = require('../models/Channel');
const Video = require('../models/Video');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new channel
// Requires authentication.  The authenticated user becomes the owner of the channel.
router.post('/', auth, async (req, res) => {
  try {
    const { channelName, description = '', channelBanner = '' } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    const channel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: req.user._id
    });

    await channel.save();
    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });

    res.status(201).json(channel);
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ message: 'Server error creating channel' });
  }
});

// Get channels owned by the current user
router.get('/my', auth, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id }).populate('videos');
    res.json(channels);
  } catch (error) {
    console.error('Fetch my channels error:', error);
    res.status(500).json({ message: 'Server error fetching channels' });
  }
});

// Get a channel by id including its videos
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id)
      .populate({ path: 'videos', options: { sort: { uploadDate: -1 } } })
      .populate('owner', 'username avatar');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error('Fetch channel error:', error);
    res.status(500).json({ message: 'Server error fetching channel' });
  }
});

// Delete a channel (owner only).  Removes channel and all its videos.
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this channel' });
    }

    // Delete all videos associated with this channel
    await Video.deleteMany({ channel: id });
    // Remove channel id from user's channels array
    await User.findByIdAndUpdate(req.user._id, { $pull: { channels: id } });
    await Channel.findByIdAndDelete(id);
    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Delete channel error:', error);
    res.status(500).json({ message: 'Server error deleting channel' });
  }
});

module.exports = router;