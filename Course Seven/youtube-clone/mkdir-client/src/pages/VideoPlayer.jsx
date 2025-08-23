import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { currentUser } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    fetchVideoData();
    fetchRelatedVideos();
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      const response = await axios.get(`/api/videos/${videoId}`);
      setVideo(response.data.video);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`/api/videos/related/${videoId}`);
      setRelatedVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching related videos:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/videos/${videoId}/comments`, {
        text: newComment
      });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/videos/${videoId}/like`);
      setVideo(prev => ({ ...prev, likes: prev.likes + 1 }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`/api/videos/${videoId}/dislike`);
      setVideo(prev => ({ ...prev, dislikes: prev.dislikes + 1 }));
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (!video) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="video-player-container">
      <div className="video-main">
        <div className="video-wrapper">
          <div className="video-container">
            <video controls className="video-element">
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>
            <div className="video-stats">
              <span className="views">{video.views} views</span>
              <span className="upload-date">• {new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="video-actions">
              <button className="action-btn like-btn" onClick={handleLike}>
                <i className="fas fa-thumbs-up"></i>
                <span>{video.likes}</span>
              </button>
              <button className="action-btn dislike-btn" onClick={handleDislike}>
                <i className="fas fa-thumbs-down"></i>
                <span>{video.dislikes}</span>
              </button>
              <button className="action-btn share-btn">
                <i className="fas fa-share"></i>
                <span>Share</span>
              </button>
              <button className="action-btn save-btn">
                <i className="fas fa-bookmark"></i>
                <span>Save</span>
              </button>
            </div>
            
            <div className="channel-info">
              <div className="channel-avatar">
                <img src={video.channel.avatar} alt={video.channel.name} />
              </div>
              <div className="channel-details">
                <h3 className="channel-name">{video.channel.name}</h3>
                <p className="subscribers">{video.channel.subscribers} subscribers</p>
                <p className="video-description">{video.description}</p>
              </div>
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
          
          <div className="comments-section">
            <h3 className="comments-title">{comments.length} Comments</h3>
            
            {currentUser && (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-input-container">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.username}
                    className="user-avatar"
                  />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="comment-input"
                  />
                </div>
                <button 
                  type="submit" 
                  className="comment-submit-btn"
                  disabled={!newComment.trim()}
                >
                  Comment
                </button>
              </form>
            )}
            
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} className="comment">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.username}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.user.username}</span>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="video-sidebar">
        <h3 className="related-title">Up next</h3>
        <div className="related-videos">
          {relatedVideos.map(video => (
            <Link 
              key={video._id} 
              to={`/video/${video._id}`}
              className="related-video-card"
            >
              <div className="related-thumbnail">
                <img src={video.thumbnailUrl} alt={video.title} />
                <span className="video-duration">{video.duration}</span>
              </div>
              <div className="related-info">
                <h4 className="related-title">{video.title}</h4>
                <p className="related-channel">{video.channel.name}</p>
                <p className="related-views">{video.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;