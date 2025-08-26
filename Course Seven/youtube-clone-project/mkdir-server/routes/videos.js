const express = require('express');
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Fetch a list of videos
// Supports optional query parameters: search (partial title match) and category
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .sort({ uploadDate: -1 })
      .populate('channel', 'channelName')
      .lean();

    res.json(videos);
  } catch (error) {
    console.error('Fetch videos error:', error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
});

// Get a single video by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate('channel', 'channelName')
      .populate('uploader', 'username avatar')
      .lean();
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Fetch video error:', error);
    res.status(500).json({ message: 'Server error fetching video' });
  }
});

// Create a new video
router.post('/', auth, async (req, res) => {
  try {
    const {
      channelId,
      title,
      videoUrl,
      thumbnailUrl,
      description = '',
      category = 'All',
      duration = '0:00'
    } = req.body;

    if (!channelId || !title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: 'Channel, title, videoUrl and thumbnailUrl are required' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Only the owner of the channel can upload videos to it
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload to this channel' });
    }

    const video = new Video({
      channel: channelId,
      uploader: req.user._id,
      title,
      videoUrl,
      thumbnailUrl,
      description,
      category,
      duration
    });
    await video.save();
    // Add video to channel's videos array
    await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });
    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error creating video' });
  }
});

// Update a video (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Only the uploader can edit the video
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this video' });
    }
    const update = req.body;
    delete update.uploader;
    delete update.channel;
    const updated = await Video.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error updating video' });
  }
});

// Delete a video (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Only the uploader can delete the video
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    // Remove video from channel's videos array
    await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } });
    // Delete the video
    await Video.findByIdAndDelete(id);
    // Remove associated comments
    await Comment.deleteMany({ video: id });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error deleting video' });
  }
});

module.exports = router;