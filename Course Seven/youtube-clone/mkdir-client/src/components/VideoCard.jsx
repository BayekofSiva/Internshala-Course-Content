import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id || video.id}`} className="video-card-link">
      <div className="video-card">
        <div className="thumbnail">
          <img src={video.thumbnailUrl} alt={video.title} />
          <div className="video-duration">{video.duration}</div>
        </div>
        <div className="video-info">
          <div className="channel-icon"></div>
          <div className="video-details">
            <h3>{video.title}</h3>
            <p>{video.channel?.name || video.channel}</p>
            <p>{video.views} views • {video.uploadDate}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;