import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import global styles; includes classes for video cards.
import '../styles/global.css';

/**
 * VideoCard displays a single video thumbnail with its title, channel name
 * and view count.  The component has been refactored to use CSS classes
 * for styling and hover effects instead of inline style objects and
 * Framer Motion.  Animations are handled by CSS transitions.
 */
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  return (
    <div className="video-card" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="thumbnail">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
        />
      </div>
      {/* Info */}
      <div className="info">
        <h3>{video.title}</h3>
        <p className="channel-name">{video.channelName}</p>
        <p className="views">
          {video.views.toLocaleString()} views
        </p>
      </div>
    </div>
  );
};

export default VideoCard;