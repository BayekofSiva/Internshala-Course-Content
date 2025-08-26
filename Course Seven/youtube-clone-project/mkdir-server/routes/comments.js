const express = require('express');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a video
// Accepts query parameter videoId; returns comments sorted by timestamp ascending
router.get('/', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ message: 'videoId query parameter is required' });
    }
    const comments = await Comment.find({ video: videoId })
      .sort({ timestamp: 1 })
      .populate('user', 'username avatar')
      .lean();
    res.json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
});

// Add a comment to a video
router.post('/', auth, async (req, res) => {
  try {
    const { videoId, text } = req.body;
    if (!videoId || !text) {
      return res.status(400).json({ message: 'videoId and text are required' });
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const comment = new Comment({
      video: videoId,
      user: req.user._id,
      text
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error creating comment' });
  }
});

// Update a comment
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }
    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error updating comment' });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;