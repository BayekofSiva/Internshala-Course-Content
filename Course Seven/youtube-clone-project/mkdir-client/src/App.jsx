// Updated src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';
import CreateChannel from './pages/CreateChannel';
import './App.css';

function App() {
  // Sidebar open/close state for desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Search term used by the Home page to filter videos
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Header toggleSidebar={toggleSidebar} onSearch={setSearchTerm} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home sidebarOpen={sidebarOpen} searchTerm={searchTerm} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/video/:id"
                element={
                  <ProtectedRoute>
                    <VideoPlayer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channel/:id"
                element={
                  <ProtectedRoute>
                    <ChannelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-channel"
                element={
                  <ProtectedRoute>
                    <CreateChannel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;