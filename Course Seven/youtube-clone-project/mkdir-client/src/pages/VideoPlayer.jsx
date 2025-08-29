import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import RecommendedList from '../components/RecommendedList';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch the current video
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/videos/${id}`);
      if (!mounted) return;
      setVideo(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id]);

  // fetch recommendations once we know the category
  useEffect(() => {
    if (!video) return;
    let mounted = true;

    (async () => {
      try {
        // Prefer category-based recs, fallback to latest if none
        const params = {
          limit: 12,
          // if you did NOT add backend 'exclude', comment this next line
          exclude: id
        };
        if (video.category) params.category = video.category;

        let { data } = await axios.get('/api/videos', { params });
        let list = data?.videos || data || [];
        // If backend doesn't support exclude, filter locally:
        list = list.filter(v => (v._id || v.id) !== id);

        // If category returned empty, fetch again without category
        if (!list.length) {
          const res2 = await axios.get('/api/videos', { params: { limit: 12 } });
          list = (res2.data?.videos || res2.data || []).filter(v => (v._id || v.id) !== id);
        }

        if (mounted) setRecommended(list);
      } catch (e) {
        console.error('recs error', e);
      }
    })();

    return () => { mounted = false; };
  }, [video, id]);

  if (loading || !video) return <div className="content">Loading…</div>;

  const source = video.videoUrl || video.url;

  return (
    <div className="video-page">
      {/* LEFT: recommendations (your ask) */}
      <RecommendedList items={recommended} />

      {/* RIGHT: main video */}
      <main className="video-main">
        <div className="player-wrap">
          <video
            className="video-el"
            src={source}
            controls
            poster={video.thumbnailUrl || video.thumbnail}
          />
        </div>

        <h2 className="video-title">{video.title}</h2>
        <div className="video-sub">
          <span>{(video.views || 0).toLocaleString()} views</span>
          <span>•</span>
          <span>{new Date(video.uploadDate || video.createdAt).toLocaleDateString()}</span>
        </div>

        {/* like/dislike section already exists if you added it; keep it */}

        <section className="video-desc">
          <strong>{video.channelName || video.channel?.channelName || 'Channel'}</strong>
          <p>{video.description}</p>
        </section>

        <CommentSection videoId={id} />
      </main>
    </div>
  );
};

export default VideoPlayer;