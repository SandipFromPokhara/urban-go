import { Search, Filter, X, Calendar, MapPin, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { RiRobot3Fill } from "react-icons/ri";

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
  filters = {},
  sortBy,
  onSortChange
}) => {
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const navigate = useNavigate();

  // Autosuggest state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  // Flag to temporarily disable autosuggest after a selection/search
  const [suppressAutosuggest, setSuppressAutosuggest] = useState(false);

  const categories = MAIN_CATEGORIES;

  // Sync local search term when parent searchTerm changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
    // Close any open suggestions when parent confirms a search
    setShowSuggestions(false);
    setSuggestions([]);
    setSuppressAutosuggest(true);
  }, [searchTerm]);

  const handleSearchClick = () => {
    const trimmed = localSearchTerm.trim();
    setSuppressAutosuggest(true);
    onSearchChange(trimmed);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSuppressAutosuggest(true);
    onSearchChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const locations = [
    { name: 'All Locations', value: '' },
    { name: 'Helsinki', value: 'helsinki' },
    { name: 'Espoo', value: 'espoo' },
    { name: 'Vantaa', value: 'vantaa' }
  ];

  const hasActiveFilters =
    filters.category || filters.location || filters.startDate || filters.endDate;

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

  const getCategoryKeywords = (category) => {
    const keywordMap = {
      'Culture': ['culture', 'cultural', 'tradition', 'heritage', 'folk', 'ethnic'],
      'Music': ['music', 'concert', 'band', 'orchestra', 'jazz', 'classical', 'rock', 'pop'],
      'Art': ['art', 'artistic', 'exhibition', 'gallery', 'painting', 'sculpture', 'visual'],
      'History': ['history', 'historical', 'museum', 'heritage', 'archive', 'exhibition'],
      'Sports': ['sport', 'football', 'basketball', 'hockey', 'fitness', 'athletic', 'game'],
      'Food & Drink': ['food', 'drink', 'restaurant', 'cafe', 'wine', 'beer', 'culinary', 'dining'],
      'Theatre': ['theatre', 'theater', 'drama', 'play', 'performance', 'stage', 'acting'],
      'Museum': ['museum', 'exhibition', 'gallery', 'collection', 'display', 'exhibit']
    };
    
    return keywordMap[category] || [category.toLowerCase()];
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'category') {
      const keywords = value ? getCategoryKeywords(value) : [];

      let categoryText = '';
      if (value) {
        if (value === 'Food & Drink') {
          categoryText = 'food';
        } else {
          categoryText = value.toLowerCase();
        }
      }

      onFilterChange({
        ...filters,
        category: value,
        categoryKeywords: keywords,
        categoryText
      });
    } else {
      onFilterChange({
        ...filters,
        [filterName]: value
      });
    }
  };

  // AUTOSUGGEST: fetch suggestions as user types
  useEffect(() => {
    let active = true;
    const term = localSearchTerm.trim();
    const hasNumbers = /\d/.test(term);

    // If autosuggest is suppressed (after selection/search)
    if (suppressAutosuggest) {
      setIsFetchingSuggestions(false);
      setShowSuggestions(false);
      setSuggestions([]);
      return () => {
        active = false;
      };
    }

    if (!term || term.length < 3 || hasNumbers) {
      setSuggestions([]);
      setShowSuggestions(false);
      return () => {
        active = false;
      };
    }

    setIsFetchingSuggestions(true);

    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('page_size', '5');
        params.set('language', 'en');
        params.set('start', 'today');
        params.set('sort', 'name');
        params.set('text', term);

        const res = await fetch(`http://localhost:5001/api/events?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await res.json();
        if (!active) return;

        if (!data.success || !Array.isArray(data.data)) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        const mapped = data.data.map((ev) => ({
          id: ev.apiId,
          name:
            ev.name?.en ||
            ev.name?.fi ||
            ev.name?.sv ||
            'Untitled event',
          location:
            ev.location?.name?.en ||
            ev.location?.city?.en ||
            ''
        }));

        setSuggestions(mapped);
        setShowSuggestions(mapped.length > 0);
      } catch (err) {
        if (!active) return;
        console.error('Suggestion fetch error:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        if (active) {
          setIsFetchingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [localSearchTerm, suppressAutosuggest]);

  const handleSuggestionClick = (suggestion) => {
    // Disable autosuggest for this cycle and trigger real search
    setSuppressAutosuggest(true);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearchChange(suggestion.name);
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
                onChange={(e) => {
                  const value = e.target.value;
                  setLocalSearchTerm(value);
                
                  setSuppressAutosuggest(false);

                  if (value.trim().length >= 3) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  setIsInputFocused(true);
                  if (!suppressAutosuggest && suggestions.length > 0 && localSearchTerm.trim().length >= 3) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                style={{ 
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb',
                  height: '38px',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                className={`search-input w-full pl-9 pr-10 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                }`}
              />

              {/* "Searching..." indicator for main search */}
              {searching && searchTerm && (
                <span 
                  className="absolute top-1/2 transform -translate-y-1/2 text-xs"
                  style={{ 
                    right: '2.25rem',
                    color: '#3b82f6' 
                  }}
                >
                  Searching...
                </span>
              )}

              {/* Clear search button */}
              {localSearchTerm && !searching && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleClearSearch();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-xs"
                  style={{
                    padding: '0 4px',
                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                    color: isDarkMode ? '#f9fafb' : '#111827',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div
                  className="absolute left-0 right-0 mt-1 rounded-lg shadow-lg z-20 text-sm"
                  style={{
                    backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}
                >
                  {isFetchingSuggestions && (
                    <div
                      className="px-3 py-2 text-xs"
                      style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      Searching events...
                    </div>
                  )}

                  {!isFetchingSuggestions && suggestions.length === 0 && (
                    <div
                      className="px-3 py-2 text-xs"
                      style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
                    >
                      No matching events
                    </div>
                  )}

                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        handleSuggestionClick(s);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
                      style={{
                        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                        color: isDarkMode ? '#e5e7eb' : '#111827'
                      }}
                    >
                      <div className="font-medium truncate">
                        {s.name}
                      </div>
                      {s.location && (
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        >
                          {s.location}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-1"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                height: '38px'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb')}
            >
              Search
            </button>
          </div>
          
          {/* Filter Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-lg transition-all duration-200 sm:shrink-0 relative cursor-pointer hover:-translate-y-1"
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

          <button
            className="flex items-center justify-center rounded-lg text-lg transition-all duration-200 sm:shrink-0 relative hover:-translate-y-1 cursor-pointer"
            style={{
              backgroundColor: isDarkMode ? '#2563eb' : '#3b82f6', // set your preferred BG
              color: '#ffffff', // text color
              padding: '0 12px',
              height: '38px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDarkMode ? '#1d4ed8' : '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDarkMode ? '#2563eb' : '#3b82f6';
            }}
            onClick={() => navigate("/ai")}
          >
            <RiRobot3Fill className="mr-1" /> AI Mode
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
              {/* Category Filter */}
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
