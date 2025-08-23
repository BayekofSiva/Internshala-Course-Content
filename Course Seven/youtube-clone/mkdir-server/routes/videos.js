const express = require('express');
const mongoose = require('mongoose');
let Video, Channel;

try {
  Video = require('../models/Video');
  Channel = require('../models/Channel');
} catch (error) {
  console.warn('Video or Channel models not available, using mock data');
}

const router = express.Router();

// Get video by ID
router.get('/:videoId', async (req, res) => {
  try {
    // If models are not available, use mock data
    if (!Video || !Channel) {
      const mockVideo = {
        _id: req.params.videoId,
        title: "Sample Video",
        description: "This is a sample video description",
        thumbnailUrl: "https://i.ytimg.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
        videoUrl: "https://example.com/sample-video.mp4",
        duration: "10:30",
        channel: {
          _id: "channel01",
          name: "Sample Channel",
          avatar: "https://ui-avatars.com/api/?name=Sample+Channel&background=random",
          subscribers: 15000
        },
        views: 15000,
        likes: 1023,
        dislikes: 45,
        createdAt: new Date().toISOString()
      };
      return res.json({ video: mockVideo, comments: [] });
    }

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
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search videos
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    
    // If models are not available, use mock data
    if (!Video || !Channel) {
      const mockVideos = [
        {
          _id: '1',
          title: "Learn React in 30 Minutes - Beginner's Tutorial",
          channel: { 
            _id: 'channel01', 
            name: "CodeWithJohn", 
            avatar: "https://ui-avatars.com/api/?name=CodeWithJohn&background=random" 
          },
          views: 15000,
          duration: "14:30",
          thumbnailUrl: "https://i.ytimg.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
          uploadDate: "2 days ago"
        },
        {
          _id: '2',
          title: "JavaScript Basics for Beginners - Crash Course",
          channel: { 
            _id: 'channel02', 
            name: "WebDev Simplified", 
            avatar: "https://ui-avatars.com/api/?name=WebDev&background=random" 
          },
          views: 42000,
          duration: "22:15",
          thumbnailUrl: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
          uploadDate: "1 week ago"
        }
      ];
      
      const filteredVideos = query 
        ? mockVideos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.channel.name.toLowerCase().includes(query.toLowerCase())
          )
        : mockVideos;
      
      return res.json({ videos: filteredVideos });
    }
    
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
    console.error('Error searching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related videos
router.get('/related/:videoId', async (req, res) => {
  try {
    // If models are not available, use mock data
    if (!Video || !Channel) {
      const mockVideos = [
        {
          _id: '3',
          title: "React Hooks Tutorial",
          channel: { 
            _id: 'channel03', 
            name: "React Mastery", 
            avatar: "https://ui-avatars.com/api/?name=React+Mastery&background=random" 
          },
          views: 28000,
          duration: "18:22",
          thumbnailUrl: "https://i.ytimg.com/vi/dGcsHMXbSOA/maxresdefault.jpg",
          uploadDate: "3 days ago"
        },
        {
          _id: '4',
          title: "Node.js Crash Course",
          channel: { 
            _id: 'channel04', 
            name: "Node Ninjas", 
            avatar: "https://ui-avatars.com/api/?name=Node+Ninjas&background=random" 
          },
          views: 35000,
          duration: "25:45",
          thumbnailUrl: "https://i.ytimg.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
          uploadDate: "1 week ago"
        }
      ];
      
      return res.json({ videos: mockVideos });
    }
    
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
    console.error('Error fetching related videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to video
router.post('/:videoId/comments', async (req, res) => {
  try {
    // You'll need to implement a Comment model
    // This is a placeholder implementation
    const comment = {
      _id: Math.random().toString(36).substr(2, 9),
      text: req.body.text,
      user: {
        _id: req.user?._id || 'user01',
        username: req.user?.username || 'TestUser',
        avatar: req.user?.avatar || 'https://ui-avatars.com/api/?name=Test+User&background=random'
      },
      createdAt: new Date()
    };
    
    res.json({ comment });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like video
router.post('/:videoId/like', async (req, res) => {
  try {
    // If models are not available, use mock response
    if (!Video) {
      return res.json({ message: 'Video liked (mock)' });
    }
    
    const video = await Video.findById(req.params.videoId);
    video.likes += 1;
    await video.save();
    res.json({ message: 'Video liked' });
  } catch (error) {
    console.error('Error liking video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike video
router.post('/:videoId/dislike', async (req, res) => {
  try {
    // If models are not available, use mock response
    if (!Video) {
      return res.json({ message: 'Video disliked (mock)' });
    }
    
    const video = await Video.findById(req.params.videoId);
    video.dislikes += 1;
    await video.save();
    res.json({ message: 'Video disliked' });
  } catch (error) {
    console.error('Error disliking video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;