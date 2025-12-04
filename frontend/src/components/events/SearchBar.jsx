import { Search, Filter, X, Calendar, MapPin, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

const MAIN_CATEGORIES = [
  'Culture',
  'Music',
  'Art',
  'History',
  'Sports',
  'Food & Drink',
  'Theatre',
  'Museum'
];

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  isDarkMode, 
  searching = false,
  onFilterChange,
  filters = {}
}) => {
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  // ⬇️ NO API FETCH — just use main categories
  const categories = MAIN_CATEGORIES;

  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  const handleSearchClick = () => {
    onSearchChange(localSearchTerm.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Helsinki Metropolitan Area locations
  const locations = [
    { name: 'All Locations', value: '' },
    { name: 'Helsinki', value: 'helsinki' },
    { name: 'Espoo', value: 'espoo' },
    { name: 'Vantaa', value: 'vantaa' },
    { name: 'Kauniainen', value: 'kauniainen' }
  ];

  const hasActiveFilters = filters.category || filters.location || filters.startDate || filters.endDate;

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      categoryKeywords: [],
      categoryText: '',
      location: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'category') {
      // Use the chosen main category as text search
      onFilterChange({
        ...filters,
        category: value,
        categoryKeywords: [],
        categoryText: value ? value.toLowerCase() : ''
      });
    } else {
      onFilterChange({
        ...filters,
        [filterName]: value
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-3`}>
        {/* Search Row */}
        <div className="flex flex-row gap-3 items-center">
          {/* Search Input with Button */}
          <div 
            className="flex-1 relative flex gap-2"
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200" 
                style={{ color: '#3b82f6' }}
              />
              
              <input
                type="text"
                placeholder="Search events by name..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{ 
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
                  height: '38px',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                className={`search-input w-full pl-9 pr-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                }`}
              />
              
              {searching && searchTerm && (
                <span 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs"
                  style={{ color: '#3b82f6' }}
                >
                  Searching...
                </span>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                height: '38px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Search
            </button>
          </div>
          
          {/* Filter Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-lg transition-all duration-200 sm:shrink-0 relative"
            style={{
              backgroundColor: showFilters || hasActiveFilters
                ? '#2563eb'
                : (isDarkMode ? '#1f2937' : '#ffffff'),
              color: showFilters || hasActiveFilters ? '#ffffff' : (isDarkMode ? '#3b82f6' : '#574199'),
              border: showFilters || hasActiveFilters
                ? '3px solid #2563eb'
                : (isDarkMode ? '3px solid #3b82f6' : '3px solid #3b82f6'),
              boxShadow: showFilters || hasActiveFilters 
                ? '0 4px 20px rgba(37, 99, 235, 0.4)' 
                : '0 4px 15px rgba(37, 99, 235, 0.15)',
              height: '38px',
              width: '38px',
              borderRadius: '50%'
            }}
          >
            <Filter 
              className="w-4 h-4 transition-colors duration-200" 
              style={{ color: showFilters || hasActiveFilters ? '#ffffff' : (isDarkMode ? '#3b82f6' : '#574199') }} 
            />
            {hasActiveFilters && (
              <span 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: '#ef4444' }}
              />
            )}
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                color: isDarkMode ? '#f3f4f6' : '#374151'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
              }}
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Filters Row */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Category Filter - LIMITED MAIN CATEGORIES */}
              <div className="relative">
                <label 
                  className="block text-xs font-medium mb-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb'
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="relative">
                <label 
                  className="block text-xs font-medium mb-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Location
                </label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb'
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                >
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date Filter */}
              <div className="relative">
                <label 
                  className="block text-xs font-medium mb-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
                    colorScheme: isDarkMode ? 'dark' : 'light'
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>

              {/* End Date Filter */}
              <div className="relative">
                <label 
                  className="block text-xs font-medium mb-1"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  <Calendar className="w-3 h-3 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  min={filters.startDate || ''}
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
                    colorScheme: isDarkMode ? 'dark' : 'light'
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.category && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDarkMode ? '#1e40af' : '#dbeafe',
                      color: isDarkMode ? '#93c5fd' : '#1e40af'
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDarkMode ? '#1e40af' : '#dbeafe',
                      color: isDarkMode ? '#93c5fd' : '#1e40af'
                    }}
                  >
                    <MapPin className="w-3 h-3" />
                    {locations.find(loc => loc.value === filters.location)?.name || filters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.startDate && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDarkMode ? '#1e40af' : '#dbeafe',
                      color: isDarkMode ? '#93c5fd' : '#1e40af'
                    }}
                  >
                    <Calendar className="w-3 h-3" />
                    From: {new Date(filters.startDate).toLocaleDateString()}
                    <button
                      onClick={() => handleFilterChange('startDate', '')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.endDate && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: isDarkMode ? '#1e40af' : '#dbeafe',
                      color: isDarkMode ? '#93c5fd' : '#1e40af'
                    }}
                  >
                    <Calendar className="w-3 h-3" />
                    To: {new Date(filters.endDate).toLocaleDateString()}
                    <button
                      onClick={() => handleFilterChange('endDate', '')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
