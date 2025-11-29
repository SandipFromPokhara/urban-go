import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ searchTerm, onSearchChange, isDarkMode }) => {
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const isInputActive = isInputHovered || isInputFocused;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-3`}>
        <div className="flex flex-row gap-3 items-center">
          {/* Search Input */}
          <div 
            className="flex-1 relative"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200" 
              style={{ color: isInputActive ? '#574199' : '#3b82f6' }}
            />
            <input
              type="text"
              placeholder="Search events by name, category, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              style={{ 
                color: isDarkMode ? '#f3f4f6' : '#111827',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
                height: '38px'
              }}
              className={`search-input w-full pl-9 pr-4 py-2 rounded-lg outline-none text-sm ${
                isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
            />
          </div>
          
          {/* Filter Button - Icon Only */}
          <button 
            className="flex items-center justify-center rounded-lg transition-all duration-200 sm:shrink-0"
            style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#3b82f6' : '#574199',
              border: isButtonHovered 
                ? (isDarkMode ? '3px solid #574199' : '3px solid #574199')
                : (isDarkMode ? '3px solid #3b82f6' : '3px solid #3b82f6'),
              boxShadow: isButtonHovered ? '0 4px 20px rgba(136, 89, 247, 0.3)' : '0 4px 15px rgba(37, 99, 235, 0.15)',
              transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
              height: '38px',
              width: '38px',
              borderRadius: '50%'
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <Filter 
              className="w-4 h-4 transition-colors duration-200" 
              style={{ color: isButtonHovered ? '#574199' : '#3b82f6' }} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;