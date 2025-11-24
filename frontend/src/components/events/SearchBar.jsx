import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const isInputActive = isInputHovered || isInputFocused;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search Input */}
          <div 
            className="flex-1 relative"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200" 
              style={{ color: isInputActive ? '#574199' : '#3b82f6' }}
            />
            <input
              type="text"
              placeholder="Search events by name, category, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              style={{ color: '#111827' }}
              className="search-input w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white"
            />
          </div>
          
          {/* Filter Button - Fixed width on larger screens */}
          <button 
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 sm:shrink-0 sm:w-auto w-full"
            style={{
              backgroundColor: '#ffffff',
              color: '#374151',
              border: isButtonHovered ? '3px solid #574199' : '3px solid #3b82f6',
              boxShadow: isButtonHovered ? '0 4px 20px rgba(136, 89, 247, 0.3)' : '0 4px 15px rgba(37, 99, 235, 0.15)',
              transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
              height: '48px',
              borderRadius: '50px',
              minWidth: '120px', // Minimum width for button
              maxWidth: '150px' // Maximum width for button on mobile
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <Filter 
              className="w-5 h-5 transition-colors duration-200 shrink-0" 
              style={{ color: isButtonHovered ? '#574199' : '#3b82f6' }} 
            />
            <span style={{ color: '#1e40af', fontWeight: '600', whiteSpace: 'nowrap' }}>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;