import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

/**
 * VideoPlayer page
 *
 * Fetches the selected video by id from the API and renders a video element
 * along with metadata such as title, description, views and like/dislike
 * counters.  Below the video we render the CommentSection component which
 * handles displaying, creating and editing comments for this video.
 */
const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/videos/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!video) {
    return <div className="error">Video not found.</div>;
  }

  return (
    <div className="video-player-page">
      <div className="video-wrapper">
        {/* Use the native video element; in a real app you might embed YouTube or another player */}
        <video src={video.videoUrl} controls width="100%" />
      </div>
      <div className="video-meta">
        <h2 className="video-title">{video.title}</h2>
        <p className="video-stats">
          {video.views ? video.views.toLocaleString() : 0} views •{' '}
          {new Date(video.uploadDate).toLocaleDateString()}
        </p>
        <div className="video-actions">
          <button className="like-button">
            <i className="fas fa-thumbs-up"></i> {video.likes}
          </button>
          <button className="dislike-button">
            <i className="fas fa-thumbs-down"></i> {video.dislikes}
          </button>
        </div>
        <p className="video-description">{video.description}</p>
      </div>
      <CommentSection videoId={video._id || id} />
    </div>
  );
};

export default VideoPlayer;