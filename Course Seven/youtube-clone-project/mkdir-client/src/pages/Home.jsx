import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import VideoCard from '../components/VideoCard';

/**
 * Home page
 *
 * Displays a list of videos in a responsive grid.  Users can filter by
 * category via the FilterBar and search for videos by title.  When the
 * `searchTerm` or selected filter changes, the page fetches matching videos
 * from the API.  The sidebar is toggled by the parent component and passed
 * down as the `sidebarOpen` prop.
 */
const Home = ({ sidebarOpen, searchTerm }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (activeFilter && activeFilter !== 'All') params.category = activeFilter;
        const response = await axios.get('/api/videos', { params });
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, [searchTerm, activeFilter]);

  return (
    <div className="main-content">
      <Sidebar isOpen={sidebarOpen} />
      <div className="content">
        <FilterBar activeFilter={activeFilter} onChange={setActiveFilter} />
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;