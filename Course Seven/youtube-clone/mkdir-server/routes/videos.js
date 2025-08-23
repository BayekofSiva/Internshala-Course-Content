const express = require('express');
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

const router = express.Router();

// Get video by ID
router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId)
      .populate('channel', 'name avatar subscribers')
      .populate('uploader', 'username avatar');
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Increment views
    video.views += 1;
    await video.save();
    
    // Get comments (you'll need to implement comments model)
    const comments = []; // Replace with actual comments query
    
    res.json({ video, comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search videos
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .populate('channel', 'name avatar')
    .limit(20);
    
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related videos
router.get('/related/:videoId', async (req, res) => {
  try {
    const currentVideo = await Video.findById(req.params.videoId);
    
    if (!currentVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const relatedVideos = await Video.find({
      _id: { $ne: currentVideo._id },
      $or: [
        { category: currentVideo.category },
        { tags: { $in: currentVideo.tags } },
        { channel: currentVideo.channel }
      ]
    })
    .populate('channel', 'name')
    .limit(10);
    
    res.json({ videos: relatedVideos });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to video
router.post('/:videoId/comments', auth, async (req, res) => {
  try {
    // You'll need to implement a Comment model
    // This is a placeholder implementation
    const comment = {
      _id: Math.random().toString(36).substr(2, 9),
      text: req.body.text,
      user: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar
      },
      createdAt: new Date()
    };
    
    res.json({ comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like video
router.post('/:videoId/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    video.likes += 1;
    await video.save();
    res.json({ message: 'Video liked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike video
router.post('/:videoId/dislike', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    video.dislikes += 1;
    await video.save();
    res.json({ message: 'Video disliked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;