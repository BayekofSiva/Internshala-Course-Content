import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import CommentList from './CommentList';

/**
 * VideoPlayerPage shows a single video's playback page.  It displays
 * the video player, title, description, channel name, like/dislike buttons
 * and a comment section.
 */
const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/videos/${id}`);
        setVideo(res.data);
        setLikes(res.data.likes || 0);
        setDislikes(res.data.dislikes || 0);
      } catch (err) {
        // Fallback to sample data
        setVideo({
          _id: id,
          title: 'Sample Video',
          description: 'This is a sample video description.',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          channelName: 'Demo Channel',
          likes: 0,
          dislikes: 0
        });
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    setLikes((prev) => prev + 1);
    try {
      await axios.post(`/api/videos/${id}/like`);
    } catch (err) {
      // revert on error
      setLikes((prev) => prev - 1);
    }
  };

  const handleDislike = async () => {
    setDislikes((prev) => prev + 1);
    try {
      await axios.post(`/api/videos/${id}/dislike`);
    } catch (err) {
      setDislikes((prev) => prev - 1);
    }
  };

  if (!video) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Video element */}
        <div style={{ width: '100%', backgroundColor: 'black', position: 'relative', paddingTop: '56.25%' }}>
          <video
            src={video.videoUrl}
            controls
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
        {/* Video details */}
        <h2 style={{ margin: '0.5rem 0' }}>{video.title}</h2>
        <p style={{ margin: '0.25rem 0', color: 'var(--muted)' }}>{video.channelName}</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleLike}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'transparent', color: 'var(--primary)' }}
          >
            👍 {likes}
          </button>
          <button
            onClick={handleDislike}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'transparent', color: 'var(--accent)' }}
          >
            👎 {dislikes}
          </button>
        </div>
        <p style={{ marginTop: '1rem' }}>{video.description}</p>
        {/* Comments */}
        <CommentList videoId={id} currentUser={user} />
      </div>
    </div>
  );
};

export default VideoPlayerPage;