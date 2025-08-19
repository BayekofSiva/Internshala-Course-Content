const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const Channel = require('../models/Channel');
const User = require('../models/User');
const Video = require('../models/Video');

const router = express.Router();

// Get current user's channel (if exists)
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) return res.status(404).json({ message: 'No channel found' });
    res.json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new channel
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { channelName, description } = req.body;
    if (!channelName) return res.status(400).json({ message: 'Channel name is required' });
    // Check if user already has a channel
    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing) return res.status(400).json({ message: 'User already has a channel' });
    const channel = await Channel.create({ channelName, description, owner: req.user._id });
    // update user's channels list
    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });
    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get channel by id with videos populated
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate({
      path: 'videos',
      select: 'title thumbnailUrl description channelId views likes dislikes',
      options: { sort: { createdAt: -1 } }
    });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;