import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

/**
 * VideoUpload allows channel owners to upload new videos.  For simplicity the
 * user enters video metadata (title, description, category, video URL and
 * thumbnail URL).  After successful upload the user is redirected to their
 * channel page.
 */
const VideoUpload = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [channelId, setChannelId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('education');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState(null);

  // Fetch the user's channel or create one if absent
  useEffect(() => {
    const fetchOrCreateChannel = async () => {
      try {
        const res = await axios.get('/api/channels/me', { withCredentials: true });
        setChannelId(res.data._id);
      } catch (err) {
        // If no channel exists, create one with a default name
        if (user) {
          const newChannel = await axios.post(
            '/api/channels',
            { channelName: `${user.username}'s Channel`, description: '' },
            { withCredentials: true }
          );
          setChannelId(newChannel.data._id);
        }
      }
    };
    fetchOrCreateChannel();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/videos',
        { title, description, category, videoUrl, thumbnailUrl, channelId },
        { withCredentials: true }
      );
      navigate(`/channel/${channelId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video');
    }
  };

  if (!user) return <div className="container">You must be signed in to upload videos.</div>;

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '1rem' }}>
      <h2>Upload Video</h2>
      {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)', resize: 'vertical' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        >
          <option value="education">Education</option>
          <option value="music">Music</option>
          <option value="gaming">Gaming</option>
          <option value="technology">Technology</option>
          <option value="movies">Movies</option>
        </select>
        <input
          type="url"
          placeholder="Video URL (e.g. mp4 link)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <input
          type="url"
          placeholder="Thumbnail URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <button
          type="submit"
          style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;