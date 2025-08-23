// src/components/FilterBar.jsx
import { useState } from 'react'

const FilterBar = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const filters = [
    'All', 'Music', 'Gaming', 'Live', 'Coding', 'React', 
    'JavaScript', 'MERN Stack', 'Node.js', 'MongoDB', 'Recently uploaded'
  ]

  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <div 
          key={filter} 
          className={`filter-item ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </div>
      ))}
    </div>
  )
}

export default FilterBar