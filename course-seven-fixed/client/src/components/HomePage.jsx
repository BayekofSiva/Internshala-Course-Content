import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';
import VideoCard from './VideoCard';
// Import global styles to apply video grid, buttons etc.
import '../styles/global.css';

/**
 * HomePage fetches and displays a grid of videos.  Videos can be filtered
 * by category (`cat` query parameter) and searched by title (`q` query
 * parameter).  Inline styles and Framer Motion have been removed in favour
 * of CSS classes with transitions and animations.
 */
const categories = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'music', label: 'Music' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'technology', label: 'Technology' },
  { key: 'movies', label: 'Movies' },
];

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCat = searchParams.get('cat') || 'all';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await API.get('/videos', {
          params: {
            category:
              selectedCat !== 'all' ? selectedCat : undefined,
            search: searchQuery || undefined,
          },
        });
        setVideos(res.data || []);
      } catch (err) {
        // Fallback to sample data in case of error
        setVideos([
          {
            _id: 'video01',
            title: 'Learn React in 30 Minutes',
            thumbnailUrl:
              'https://dummyimage.com/320x180/008080/ffffff&text=React+30min',
            description:
              'A quick tutorial to get started with React.',
            channelName: 'Code with John',
            views: 15200,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [selectedCat, searchQuery]);

  const handleCategoryClick = (catKey) => {
    const params = new URLSearchParams(searchParams);
    if (catKey === 'all') params.delete('cat');
    else params.set('cat', catKey);
    navigate({ pathname: '/', search: params.toString() });
  };

  return (
    <div className="container home-container">
      {/* Filter buttons */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`btn ${
              selectedCat === cat.key
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Video Grid */}
      {loading ? (
        <p>Loading videos...</p>
      ) : videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;