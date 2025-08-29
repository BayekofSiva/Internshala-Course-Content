import { useNavigate } from 'react-router-dom';

const RecommendedList = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <aside className="recommendations">
      {items.map(v => {
        const id = v._id || v.id;
        const thumb = v.thumbnailUrl || v.thumbnail;
        const channelName = v.channelName || v.channel?.channelName || 'Channel';
        return (
          <div key={id} className="rec-card" onClick={() => navigate(`/video/${id}`)}>
            <div className="rec-thumb">
              <img src={thumb} alt={v.title} />
              {v.duration && <span className="rec-duration">{v.duration}</span>}
            </div>
            <div className="rec-meta">
              <h4 className="rec-title">{v.title}</h4>
              <div className="rec-sub">{channelName}</div>
              <div className="rec-sub">{(v.views || 0).toLocaleString()} views</div>
            </div>
          </div>
        );
      })}
    </aside>
  );
};

export default RecommendedList;
