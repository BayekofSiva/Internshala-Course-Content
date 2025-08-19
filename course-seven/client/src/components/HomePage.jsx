import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import VideoCard from './VideoCard';
import { motion } from 'framer-motion';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'music', label: 'Music' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'technology', label: 'Technology' },
  { key: 'movies', label: 'Movies' }
];

/**
 * HomePage fetches and displays a grid of videos.  Videos can be filtered by
 * category (`cat` query parameter) and searched by title (`q` query parameter).
 */
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
        const res = await axios.get('/api/videos', {
          params: {
            category: selectedCat !== 'all' ? selectedCat : undefined,
            search: searchQuery || undefined
          }
        });
        setVideos(res.data || []);
      } catch (err) {
        // Fallback to sample data in case of error
        setVideos([
          {
            _id: 'video01',
            title: 'Learn React in 30 Minutes',
            thumbnailUrl: 'https://dummyimage.com/320x180/008080/ffffff&text=React+30min',
            description: 'A quick tutorial to get started with React.',
            channelName: 'Code with John',
            views: 15200
          }
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
    <div className="container" style={{ paddingTop: '1rem' }}>
      {/* Filter buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '16px',
              backgroundColor: selectedCat === cat.key ? 'var(--primary)' : 'var(--surface)',
              color: selectedCat === cat.key ? 'white' : 'var(--text)',
              border: `1px solid var(--primary)`,
              transition: 'background-color 0.3s'
            }}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem'
          }}
        >
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;