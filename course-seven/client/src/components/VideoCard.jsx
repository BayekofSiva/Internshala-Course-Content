import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * VideoCard displays a single video thumbnail with its title, channel name
 * and view count.  Clicking the card navigates to the video player page.
 */
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        backgroundColor: 'var(--surface)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {/* Info */}
      <div style={{ padding: '0.5rem 0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>{video.title}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>{video.channelName}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>{video.views.toLocaleString()} views</p>
      </div>
    </motion.div>
  );
};

export default VideoCard;