// Updated src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import VideoCard from './components/VideoCard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import VideoPlayer from './pages/VideoPlayer';
import SearchResults from './pages/SearchResults';


// Update the Routes component
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/video/:videoId" element={
    <ProtectedRoute>
      <VideoPlayer />
    </ProtectedRoute>
  } />
  <Route path="/" element={
    <ProtectedRoute>
      <div className="main-content">
        <Sidebar isOpen={sidebarOpen} />
        <div className="content">
          <FilterBar />
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  } />
  <Route path="/search" element={
  <ProtectedRoute>
    <div className="main-content">
      <Sidebar isOpen={sidebarOpen} />
      <div className="content">
        <SearchResults />
      </div>
    </div>
  </ProtectedRoute>
} />
</Routes>

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample video data
  const videos = [
    // ... (same as before)
  ];

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="main-content">
                  <Sidebar isOpen={sidebarOpen} />
                  <div className="content">
                    <FilterBar />
                    <div className="video-grid">
                      {videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;