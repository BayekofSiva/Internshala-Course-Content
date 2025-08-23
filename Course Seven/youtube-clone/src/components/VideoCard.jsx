// src/components/VideoCard.jsx
const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <div className="thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-duration">{video.duration}</div>
      </div>
      <div className="video-info">
        <div className="channel-icon"></div>
        <div className="video-details">
          <h3>{video.title}</h3>
          <p>{video.channel}</p>
          <p>{video.views}</p>
        </div>
      </div>
    </div>
  )
}

export default VideoCard