// src/components/VideoCard.jsx
import { useNavigate } from 'react-router-dom';

/**
 * VideoCard component
 *
 * Renders the thumbnail, title, channel name and view count for a single video.
 * Clicking anywhere on the card navigates to the dedicated video page.
 */
const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/video/${video._id || video.id}`);
  };
  return (
    <div className="video-card" onClick={handleClick}>
      <div className="thumbnail">
        <img
          src={video.thumbnailUrl || video.thumbnail}
          alt={video.title}
        />
        <div className="video-duration">{video.duration}</div>
      </div>
      <div className="video-info">
        <div className="channel-icon"></div>
        <div className="video-details">
          <h3>{video.title}</h3>
          <p>{video.channel?.channelName || video.channel?.name || video.channel}</p>
          <p>{video.views ? video.views.toLocaleString() : 0} views</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;