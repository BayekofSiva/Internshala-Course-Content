// src/components/Sidebar.jsx
const Sidebar = ({ isOpen }) => {
  if (!isOpen) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-item active">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-fire"></i>
        <span>Trending</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-folder"></i>
        <span>Subscriptions</span>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-item">
        <i className="fas fa-photo-video"></i>
        <span>Library</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-history"></i>
        <span>History</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-clock"></i>
        <span>Watch later</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-thumbs-up"></i>
        <span>Liked videos</span>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-heading">SUBSCRIPTIONS</div>
      <div className="sidebar-item">
        <i className="fas fa-user-circle"></i>
        <span>Tech Channel</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-user-circle"></i>
        <span>Coding Tutorials</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-user-circle"></i>
        <span>Music Videos</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-user-circle"></i>
        <span>Gaming Channel</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-user-circle"></i>
        <span>News Channel</span>
      </div>
    </aside>
  )
}

export default Sidebar