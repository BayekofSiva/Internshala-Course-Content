import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * CreateChannel page
 *
 * Allows a logged‑in user to create a channel.  After successfully creating
 * the channel, the user is redirected to the channel page.  If the user
 * already owns channels, they can still create additional ones.
 */
const CreateChannel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ channelName: '', description: '', channelBanner: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/channel', formData);
      const channel = response.data;
      // Navigate to the newly created channel
      navigate(`/channel/${channel._id}`);
    } catch (err) {
      console.error('Error creating channel:', err);
      setError(err.response?.data?.message || 'Failed to create channel');
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Channel</h2>
      {error && <p className="error">{error}</p>}
      <form className="channel-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Channel Name"
          value={formData.channelName}
          onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Channel Banner URL (optional)"
          value={formData.channelBanner}
          onChange={(e) => setFormData({ ...formData, channelBanner: e.target.value })}
        />
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateChannel;