import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import './SearchResults.css';

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`/api/videos/search?q=${encodeURIComponent(query)}`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Searching...</div>;
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h2>Search results for "{query}"</h2>
        <p>{videos.length} videos found</p>
      </div>
      
      <div className="search-video-grid">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No results found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;