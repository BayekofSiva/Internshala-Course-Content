// mkdir-server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Channel = require('./models/Channel');
const Video = require('./models/Video');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone');

    // 1) A demo user (password = "password123")
    let user = await User.findOne({ email: 'demo@youclone.dev' });
    if (!user) {
      user = await User.create({
        username: 'DemoUser',
        email: 'demo@youclone.dev',
        password: '$2a$12$3f0Tz5XvVnN5wHdkBf09MeY.7YwZyH2YkK1yF2F4aWm9cj7F/J7Mu', // bcrypt for "password123"
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0dd&color=fff'
      });
    }

    // 2) A demo channel
    let channel = await Channel.findOne({ owner: user._id });
    if (!channel) {
      channel = await Channel.create({
        channelName: 'Code with Demo',
        owner: user._id,
        description: 'Coding tutorials and tech reviews by Demo.',
        channelBanner: 'https://picsum.photos/seed/banner/1200/240',
        subscribers: 5200
      });
    }

    // 3) Wipe & insert demo videos
    await Video.deleteMany({ channel: channel._id });

    const sample = (title, category, seed) => ({
      title,
      description: `${title} - walkthrough`,
      channel: channel._id,
      uploader: user._id,
      videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      thumbnailUrl: `https://picsum.photos/seed/${seed}/640/360`,
      category,
      duration: '05:00',
      views: Math.floor(Math.random() * 50000) + 1000
    });

    await Video.insertMany([
      sample('Learn React in 30 Minutes', 'React', 'react30'),
      sample('Modern JavaScript Essentials', 'JavaScript', 'js-ess'),
      sample('MERN Stack Crash Course', 'MERN Stack', 'mern'),
      sample('Node.js API Basics', 'Node.js', 'node'),
      sample('MongoDB for Beginners', 'MongoDB', 'mongo'),
      sample('Live Coding Session', 'Live', 'live1'),
      sample('Music for Focus', 'Music', 'music1'),
      sample('Game Dev Bits', 'Gaming', 'gaming1'),
      sample('Clean Code Tips', 'Coding', 'coding1'),
      sample('Recently uploaded demo', 'Recently uploaded', 'recent1'),
    ]);

    console.log('✅ Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
