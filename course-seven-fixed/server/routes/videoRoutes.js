import express from 'express';
import Video from '../models/Video';

const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const Video = require('../models/Video');
const Channel = require('../models/Channel');


const router = express.Router();

// GET /api/videos
// Optional query params: search, category
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    const videos = await Video.find(filter)
      .populate('channelId', 'channelName')
      .sort({ createdAt: -1 })
      .lean();
    // Map to include channelName at top level
    const result = videos.map((v) => ({
      _id: v._id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      description: v.description,
      channelName: v.channelId.channelName,
      channelId: v.channelId._id,
      views: v.views,
      likes: v.likes,
      dislikes: v.dislikes
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('channelId', 'channelName')
      .lean();
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const result = {
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      channelId: video.channelId._id,
      channelName: video.channelId.channelName,
      category: video.category,
      views: video.views,
      likes: video.likes,
      dislikes: video.dislikes
    };
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/videos
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, category, videoUrl, thumbnailUrl, channelId } = req.body;
    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Ensure channel belongs to user
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to upload to this channel' });
    }
    const video = await Video.create({
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      channelId: channel._id
    });
    // Update channel's videos
    channel.videos.push(video._id);
    await channel.save();
    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/videos/:id (update video metadata)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    // Ensure video belongs to user's channel
    const channel = await Channel.findById(video.channelId);
    if (!channel || channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this video' });
    }
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (category !== undefined) video.category = category;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    await video.save();
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/videos/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const channel = await Channel.findById(video.channelId);
    if (!channel || channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    // Remove video from channel list
    channel.videos = channel.videos.filter((vidId) => vidId.toString() !== video._id.toString());
    await channel.save();
    // Delete video document
    await Video.findByIdAndDelete(video._id);
    res.json({ message: 'Video deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a video
router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ likes: video.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a video
router.post('/:id/dislike', isAuthenticated, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );
    res.json({ dislikes: video.dislikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;