// src/components/FilterBar.jsx
const FilterBar = ({ activeFilter, onChange }) => {
  const filters = [
    'All', 'Music', 'Gaming', 'Live', 'Coding', 'React',
    'JavaScript', 'MERN Stack', 'Node.js', 'MongoDB', 'Recently uploaded'
  ];

  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <div
          key={filter}
          className={`filter-item ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
