import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/events/SearchBar';
import EventsGrid from '../components/events/EventsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/events/Pagination';
import '../styles/events.css';

const EVENTS_PER_PAGE = 6; // Show 6 events per page
const DEBOUNCE_DELAY = 500; // 500ms debounce for filter changes

//  Helper to remove HTML tags from API descriptions
const stripHTML = (html) => {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

const EventsList = ({ isDarkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Refs for debouncing and request control
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Get filters from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    categoryKeywords: searchParams.get('keywords')
      ? searchParams.get('keywords').split(',')
      : [],
    categoryText: searchParams.get('categoryText') || '',
    location: searchParams.get('location') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      params.set('page', currentPage);
      params.set('page_size', EVENTS_PER_PAGE.toString());
      params.set('language', 'en');

      // Dates
      if (filters.startDate) {
        params.set('start', filters.startDate);
      } else {
        params.set('start', 'today'); 
      }

      if (filters.endDate) {
        params.set('end', filters.endDate);
      }

      // Location
      if (filters.location) {
        params.set('location', filters.location);
      }

      // Category text: used on backend for server-side category filter
      if (filters.categoryText) {
        params.set('categoryText', filters.categoryText);
      }

      // Send category keywords to backend
      if (filters.categoryKeywords && filters.categoryKeywords.length > 0) {
        params.set('keywords', filters.categoryKeywords.join(','));
      }

      // User search term
      if (searchTerm.trim()) {
        params.set('text', searchTerm.trim());
        params.set('search', searchTerm.trim()); 
      }

      // Sort
      if (sortBy) {
        params.set('sort', sortBy);
      }

      console.log('Fetching events with params:', Object.fromEntries(params));

<<<<<<< HEAD
      const response = await fetch(`/api/events?${params}`, {
        signal: abortControllerRef.current.signal
      });
=======
      const response = await fetch(`/api/events?${params}`);
>>>>>>> a9a9f1c59d121ed308f430c8c93aed2eac0e3092

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error('Failed to fetch events');
      }

      const result = await response.json();

      if (result.success) {
        const transformedEvents = result.data.map((event) => ({
          id: event.apiId,
          name: event.name?.en || event.name?.fi || 'Untitled Event',
      
          description: stripHTML(
            event.shortDescription?.en || event.description?.en || ''
          ),
          longDescription: stripHTML(
            event.description?.en || event.shortDescription?.en || ''
          ),
          date: event.startTime,
          endDate: event.endTime,
          location:
            event.location?.name?.en ||
            event.location?.city?.en ||
            'Helsinki',
          fullLocation: {
            name: event.location?.name?.en || '',
            street: event.location?.streetAddress?.en || '',
            city: event.location?.city?.en || '',
            postalCode: event.location?.postalCode || '',
          },
          image:
            event.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
          category: event.categories?.[0] || event.keywords?.[0]?.name?.en || '',
          tags: event.categories || [],
          isFree: event.offers?.[0]?.isFree || false,
          ticketPrice: event.offers?.[0]?.isFree
            ? 'Free Entry'
            : event.offers?.[0]?.price?.en || 'Check website for pricing',
          infoUrl: event.infoUrl?.en || '',
          provider: event.provider?.en || '',
          rawData: event,
        }));

        setEvents(transformedEvents);
        setTotalEvents(result.pagination?.total || transformedEvents.length);
        setTotalPages(result.pagination?.total_pages || 1);

        console.log('Result summary:', {
          page: result.pagination?.page,
          totalPages: result.pagination?.total_pages,
          totalEvents: result.pagination?.total,
          eventsOnPage: transformedEvents.length,
        });
      } else {
        setEvents([]);
        setTotalEvents(0);
        setTotalPages(1);
      }
    } catch (err) {
      // Ignore abort errors (they're expected when cancelling requests)
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      
      console.error('Error fetching events:', err);
      setError(err.message);
      setEvents([]);
      setTotalEvents(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Fetch when page / filters / search / sort change with debouncing
  useEffect(() => {
    const trimmed = searchTerm.trim();
    const hasNumbers = /\d/.test(trimmed);

    if (trimmed && hasNumbers) {
      console.log('Search contains numbers, showing no results');
      setEvents([]);
      setTotalEvents(0);
      setTotalPages(0);
      setLoading(false);
      setSearching(false);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // For page changes, fetch immediately. For filters, debounce.
    const isPageChange = searchParams.get('page') !== '1';
    const delay = isPageChange ? 0 : DEBOUNCE_DELAY;

    debounceTimerRef.current = setTimeout(() => {
      fetchEvents();
    }, delay);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, filters, searchTerm, sortBy]);

  // Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSearching(true);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to first page when searching
    setSearchParams(newParams);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const newParams = new URLSearchParams();
    newParams.set('page', '1');

    if (newFilters.category) {
      newParams.set('category', newFilters.category);
    }
    if (newFilters.categoryKeywords && newFilters.categoryKeywords.length > 0) {
      newParams.set('keywords', newFilters.categoryKeywords.join(','));
    }
    if (newFilters.categoryText) {
      newParams.set('categoryText', newFilters.categoryText);
    }
    if (newFilters.location) {
      newParams.set('location', newFilters.location);
    }
    if (newFilters.startDate) {
      newParams.set('startDate', newFilters.startDate);
    }
    if (newFilters.endDate) {
      newParams.set('endDate', newFilters.endDate);
    }
    if (searchTerm) {
      newParams.set('search', searchTerm);
    }
    if (sortBy) {
      newParams.set('sort', sortBy);
    }

    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial loading (first page, no filters)
  if (
    loading &&
    currentPage === 1 &&
    !searchTerm &&
    !filters.category &&
    !filters.startDate &&
    !filters.endDate &&
    !filters.location
  ) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <>
      <div
        className={`min-h-screen ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        style={{ marginTop: '0', paddingTop: '0' }}
      >
        {/* Animated Hero Section */}
        <div className="hero-section">
          <div className="hero-grid-background"></div>

          {/* 15 Floating Bubbles */}
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
          <div className="bubble bubble-6"></div>
          <div className="bubble bubble-7"></div>
          <div className="bubble bubble-8"></div>
          <div className="bubble bubble-9"></div>
          <div className="bubble bubble-10"></div>
          <div className="bubble bubble-11"></div>
          <div className="bubble bubble-12"></div>
          <div className="bubble bubble-13"></div>
          <div className="bubble bubble-14"></div>
          <div className="bubble bubble-15"></div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-content">
            <div className="hero-content-wrapper">
              <h1 className="hero-title text-6xl md:text-7xl font-bold mb-6">
                Discover Events
              </h1>
              <p className="hero-subtitle text-2xl md:text-3xl">
                Explore exciting events happening in Helsinki region
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            filters={filters}
            isDarkMode={isDarkMode}
            searching={searching}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div
              className={`${
                isDarkMode
                  ? 'bg-red-900/20 border-red-800'
                  : 'bg-red-50 border-red-200'
              } border rounded-lg p-4`}
            >
              <p
                className={`${
                  isDarkMode ? 'text-red-300' : 'text-red-800'
                }`}
              >
                Error loading events: {error}. Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator for page / filter / search changes */}
        {loading &&
          (currentPage > 1 ||
            searchTerm ||
            filters.category ||
            filters.startDate ||
            filters.endDate ||
            filters.location) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p
                  className={`mt-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {searching ? 'Searching...' : 'Loading events...'}
                </p>
              </div>
            </div>
          )}

        {/* Events Grid */}
        {!loading && (
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EventsGrid events={events} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Pagination */}
        {!loading && events.length > 0 && totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Results Count */}
        {!loading && events.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
            <p
              className={`text-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Showing{' '}
              {(currentPage - 1) * EVENTS_PER_PAGE + 1}
              -
              {Math.min(currentPage * EVENTS_PER_PAGE, totalEvents)} of{' '}
              {totalEvents} events
              {totalPages > 1 && (
                <span> • Page {currentPage} of {totalPages}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
