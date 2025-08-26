import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';

/**
 * ChannelPage
 *
 * Fetches a channel by id and displays its banner, name, description and
 * associated videos.  The channel owner can add new videos and edit or delete
 * existing ones.  A simple form is shown when creating or editing a video.
 */
const ChannelPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    description: '',
    category: 'All',
    duration: ''
  });
  const [editingVideoId, setEditingVideoId] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axios.get(`/api/channel/${id}`);
        setChannel(response.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [id]);

  const isOwner = currentUser && channel && channel.owner._id === currentUser.id;

  const refreshChannel = async () => {
    try {
      const response = await axios.get(`/api/channel/${id}`);
      setChannel(response.data);
    } catch (error) {
      console.error('Error refreshing channel:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', videoUrl: '', thumbnailUrl: '', description: '', category: 'All', duration: '' });
    setEditingVideoId(null);
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`/api/videos/${videoId}`);
      refreshChannel();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleEdit = (video) => {
    setEditingVideoId(video._id);
    setFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      description: video.description,
      category: video.category,
      duration: video.duration
    });
    setShowForm(true);
  };

  const handleAddVideo = () => {
    resetForm();
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVideoId) {
        // update existing video
        await axios.put(`/api/videos/${editingVideoId}`, formData);
      } else {
        // create new video
        await axios.post('/api/videos', { ...formData, channelId: id });
      }
      setShowForm(false);
      resetForm();
      refreshChannel();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!channel) {
    return <div className="error">Channel not found.</div>;
  }

  return (
    <div className="channel-page">
      <div className="channel-banner" style={{ backgroundImage: `url(${channel.channelBanner})` }}>
        <div className="channel-header">
          <h1>{channel.channelName}</h1>
          <p>{channel.description}</p>
          {isOwner && (
            <button className="add-video-button" onClick={handleAddVideo}>Add Video</button>
          )}
        </div>
      </div>
      {showForm && (
        <form className="video-form" onSubmit={handleFormSubmit}>
          <h3>{editingVideoId ? 'Edit Video' : 'Add New Video'}</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Video URL"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Thumbnail URL"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="Duration (e.g. 12:34)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
          </div>
        </form>
      )}
      <div className="channel-videos">
        {channel.videos && channel.videos.length > 0 ? (
          channel.videos.map((video) => (
            <div key={video._id} className="channel-video-wrapper">
              <VideoCard video={video} />
              {isOwner && (
                <div className="video-owner-controls">
                  <button onClick={() => handleEdit(video)}>Edit</button>
                  <button onClick={() => handleDelete(video._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;