import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events by name, category, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ color: '#111827' }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white placeholder-gray-400"
            />
          </div>
          
          {/* Filter Button - Placeholder for future functionality */}
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors"
            style={{
              backgroundColor: '#ffffff',
              color: '#374151'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            <Filter className="w-5 h-5" style={{ color: '#374151' }} />
            <span style={{ color: '#374151' }}>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;