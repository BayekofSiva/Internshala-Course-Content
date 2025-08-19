import React from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'music', label: 'Music' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'technology', label: 'Technology' },
  { key: 'movies', label: 'Movies' }
];

/**
 * Sidebar component.  Contains category filters for the video grid.  The
 * selected category is stored in the `cat` query parameter on the home page.
 */
const Sidebar = ({ open, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('cat') || 'all';

  const handleCategoryClick = (catKey) => {
    const params = new URLSearchParams(searchParams);
    if (catKey === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', catKey);
    }
    setSearchParams(params);
    onClose();
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: open ? 0 : -250 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 250,
        height: '100%',
        backgroundColor: 'var(--surface)',
        borderRight: `1px solid var(--muted)`,
        zIndex: 1000,
        paddingTop: '3.5rem'
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'left',
              backgroundColor: selected === cat.key ? 'var(--secondary)' : 'transparent',
              color: selected === cat.key ? 'var(--primary)' : 'var(--text)',
              fontWeight: selected === cat.key ? 'bold' : 'normal',
              border: 'none'
            }}
          >
            {cat.label}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;