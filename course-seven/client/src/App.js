import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import VideoPlayerPage from './components/VideoPlayerPage';
import ChannelPage from './components/ChannelPage';
import Login from './components/Login';
import Register from './components/Register';
import VideoUpload from './components/VideoUpload';
import { motion } from 'framer-motion';
import { fadeIn } from './styles/animations';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        {/* Animated route transitions */}
        <motion.main
          style={{ flex: 1, overflowY: 'auto' }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPlayerPage />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </motion.main>
      </div>
    </div>
  );
}

export default App;