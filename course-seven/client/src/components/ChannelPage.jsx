import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import VideoCard from './VideoCard';
import { AuthContext } from '../context/AuthContext';

const ChannelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/api/channels/${id}`);
        setChannel(res.data);
      } catch (err) {
        // Sample fallback
        setChannel({
          _id: id,
          channelName: 'Demo Channel',
          description: 'This is a demo channel description.',
          owner: 'user01',
          subscribers: 0,
          videos: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [id]);

  if (loading) return <div className="container">Loading channel...</div>;
  if (!channel) return <div className="container">Channel not found.</div>;

  const isOwner = user && user._id === channel.owner;

  return (
    <div className="container" style={{ paddingTop: '1rem' }}>
      <h2>{channel.channelName}</h2>
      <p style={{ color: 'var(--muted)' }}>{channel.description}</p>
      {isOwner ? (
        <button
          onClick={() => navigate('/upload')}
          style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', marginTop: '0.5rem' }}
        >
          Upload Video
        </button>
      ) : (
        <button
          onClick={() => alert('Subscribed!')}
          style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', marginTop: '0.5rem' }}
        >
          Subscribe
        </button>
      )}
      <h3 style={{ marginTop: '1.5rem' }}>Videos</h3>
      {channel.videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem'
          }}
        >
          {channel.videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelPage;