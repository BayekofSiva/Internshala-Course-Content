// src/App.jsx
import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FilterBar from './components/FilterBar'
import VideoCard from './components/VideoCard'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Sample video data
  const videos = [
    {
      id: 1,
      title: "Learn React in 30 Minutes - Beginner's Tutorial",
      channel: "CodeWithJohn",
      views: "15K views • 2 days ago",
      thumbnail: "https://i.ytimg.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
      duration: "14:30"
    },
    {
      id: 2,
      title: "JavaScript Basics for Beginners - Crash Course",
      channel: "WebDev Simplified",
      views: "42K views • 1 week ago",
      thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
      duration: "22:15"
    },
    {
      id: 3,
      title: "Node.js Tutorial for Beginners - Getting Started",
      channel: "The Net Ninja",
      views: "28K views • 3 weeks ago",
      thumbnail: "https://i.ytimg.com/vi/1PnVor36_40/maxresdefault.jpg",
      duration: "18:07"
    },
    {
      id: 4,
      title: "MongoDB Crash Course 2023",
      channel: "Traversy Media",
      views: "35K views • 1 month ago",
      thumbnail: "https://i.ytimg.com/vi/1u2qu-EmIRc/maxresdefault.jpg",
      duration: "25:42"
    },
    {
      id: 5,
      title: "Express.js Tutorial for Beginners",
      channel: "Programming with Mosh",
      views: "19K views • 5 days ago",
      thumbnail: "https://i.ytimg.com/vi/RGKi6LSPDLU/maxresdefault.jpg",
      duration: "16:53"
    },
    {
      id: 6,
      title: "Build a MERN Stack App - Full Tutorial",
      channel: "JavaScript Mastery",
      views: "52K views • 2 weeks ago",
      thumbnail: "https://i.ytimg.com/vi/0fYi8SGA20k/maxresdefault.jpg",
      duration: "36:22"
    },
    {
      id: 7,
      title: "CSS Grid & Flexbox for Responsive Layouts",
      channel: "Web Dev Simplified",
      views: "31K views • 3 days ago",
      thumbnail: "https://i.ytimg.com/vi/HYv55DhgTuA/maxresdefault.jpg",
      duration: "29:18"
    },
    {
      id: 8,
      title: "REST API Concepts and Examples",
      channel: "WebConcepts",
      views: "27K views • 4 weeks ago",
      thumbnail: "https://i.ytimg.com/vi/riDzcEQbX6k/maxresdefault.jpg",
      duration: "21:09"
    }
  ]

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
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
    </div>
  )
}

export default App