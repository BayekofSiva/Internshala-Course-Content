const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const Comment = require('../models/Comment');
const Video = require('../models/Video');

const router = express.Router();

// Get comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a video
router.post('/:videoId', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user._id,
      username: req.user.username,
      text
    });
    // add comment to video.comments
    await Video.findByIdAndUpdate(req.params.videoId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a comment
router.put('/:commentId', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }
    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment
router.delete('/:commentId', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    await Video.findByIdAndUpdate(comment.videoId, { $pull: { comments: comment._id } });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;