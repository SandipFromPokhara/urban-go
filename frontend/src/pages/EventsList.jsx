import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/events/SearchBar';
import EventsGrid from '../components/events/EventsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/events/Pagination';
import '../styles/events.css';

const EVENTS_PER_PAGE = 6; // Show 6 events per page

const EventsList = ({ isDarkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Get filters from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    categoryKeywords: searchParams.get('keywords') ? searchParams.get('keywords').split(',') : [],
    categoryText: searchParams.get('categoryText') || '',
    location: searchParams.get('location') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch ALL events when location filter is active
  const fetchAllEventsForLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching ALL events for location filter...');

      let allEvents = [];
      let currentFetchPage = 1;
      let totalPages = 1;
      const PAGE_SIZE = 100; // Fetch 100 at a time

      // Build query parameters (without location - we'll filter client-side)
      const baseParams = {
        page_size: PAGE_SIZE,
        language: 'en',
        start: filters.startDate || 'today'
      };

      if (filters.endDate) baseParams.end = filters.endDate;
      if (filters.categoryKeywords?.length > 0) {
        baseParams.keyword = filters.categoryKeywords.join(',');
      }

      // Add search text (combining category text search if no keywords)
      let searchText = searchTerm.trim();
      if (filters.category && (!filters.categoryKeywords || filters.categoryKeywords.length === 0)) {
        searchText = searchText
          ? `${filters.category.toLowerCase()} ${searchText}`
          : filters.category.toLowerCase();
      }
      if (searchText) baseParams.text = searchText;

      if (sortBy) baseParams.sort = sortBy === 'date' || sortBy === 'recent' ? 'start_time' : 'name';

      // 🔢 BLOCK ONLY "ONLY NUMBERS" SEARCH TERMS
      const trimmed = searchTerm.trim();
      const onlyNumbers = trimmed !== '' && /^[0-9]+$/.test(trimmed);

      if (onlyNumbers) {
        console.log('Search is only numbers, showing no results');
        setEvents([]);
        setTotalEvents(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      // Fetch pages until we have all events (max 5 pages = 500 events)
      while (currentFetchPage <= totalPages && currentFetchPage <= 5) {
        const params = new URLSearchParams({
          ...baseParams,
          page: currentFetchPage
        });

        console.log(`Fetching page ${currentFetchPage}/${totalPages}...`);

        const response = await fetch(`http://localhost:5001/api/events?${params}`);
        if (!response.ok) throw new Error('Failed to fetch events');

        const result = await response.json();

        if (result.success && result.data) {
          allEvents = allEvents.concat(result.data);
          totalPages = result.pagination?.total_pages || 1;
          currentFetchPage++;
        } else {
          break;
        }
      }

      console.log(`Fetched ${allEvents.length} total events from ${currentFetchPage - 1} pages`);

      // Transform all events
      let transformedEvents = allEvents.map(event => ({
        id: event.apiId,
        name: event.name?.en || event.name?.fi || 'Untitled Event',
        description: event.shortDescription?.en || event.description?.en || '',
        longDescription: event.description?.en || event.shortDescription?.en || '',
        date: event.startTime,
        endDate: event.endTime,
        location: event.location?.name?.en || event.location?.city?.en || 'Helsinki',
        fullLocation: {
          name: event.location?.name?.en || '',
          street: event.location?.streetAddress?.en || '',
          city: event.location?.city?.en || '',
          postalCode: event.location?.postalCode || ''
        },
        image: event.images?.[0]?.url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
        category: event.categories?.[0] || event.keywords?.[0]?.name?.en || '',
        tags: event.categories || [],
        isFree: event.offers?.[0]?.isFree || false,
        ticketPrice: event.offers?.[0]?.isFree ? 'Free Entry' : (event.offers?.[0]?.price?.en || 'Check website'),
        infoUrl: event.infoUrl?.en || '',
        provider: event.provider?.en || '',
        rawData: event
      }));

      // Filter out past events and invalid dates (before 2020)
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set to start of today
      const cutoffDate = new Date('2020-01-01');

      transformedEvents = transformedEvents.filter(event => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return false;
        if (eventDate < cutoffDate) return false;

        // Compare dates only (not times)
        const eventDateOnly = new Date(eventDate);
        eventDateOnly.setHours(0, 0, 0, 0);

        return eventDateOnly >= now;
      });

      // Filter by location
      const filteredEvents = transformedEvents.filter(event => {
        const cityMatch = event.fullLocation?.city?.toLowerCase() === filters.location.toLowerCase();
        const locationMatch = event.location?.toLowerCase().includes(filters.location.toLowerCase());
        return cityMatch || locationMatch;
      });

      console.log(`After date + location filter: ${filteredEvents.length} events in ${filters.location}`);

      // Paginate filtered results
      const totalFiltered = filteredEvents.length;
      const totalPagesFiltered = Math.ceil(totalFiltered / EVENTS_PER_PAGE);
      const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
      const endIndex = startIndex + EVENTS_PER_PAGE;
      const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

      setEvents(paginatedEvents);
      setTotalEvents(totalFiltered);
      setTotalPages(totalPagesFiltered);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching all events:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      // If location filter is active, use special fetch all function
      if (filters.location) {
        await fetchAllEventsForLocation();
        return;
      }

      setLoading(true);
      setError(null);

      // Build query parameters for normal pagination
      const params = new URLSearchParams({
        page: currentPage,
        page_size: EVENTS_PER_PAGE,
        language: 'en'
      });

      // Add date filters
      if (filters.startDate) {
        params.append('start', filters.startDate);
      } else {
        params.append('start', 'today');
      }

      if (filters.endDate) {
        params.append('end', filters.endDate);
      }

      // Add category filtering
      if (filters.categoryKeywords && filters.categoryKeywords.length > 0) {
        // Use comma-separated keywords for OR matching
        params.append('keyword', filters.categoryKeywords.join(','));
      }

      // Add search text (combining category text search if no keywords)
      let searchText = searchTerm.trim();

      // If category has no keywords, add category name to search
      if (filters.category && (!filters.categoryKeywords || filters.categoryKeywords.length === 0)) {
        searchText = searchText
          ? `${filters.category.toLowerCase()} ${searchText}`
          : filters.category.toLowerCase();
      }

      if (searchText) {
        params.append('text', searchText);
      }

      // NOTE: Location filter is handled client-side, not sent to API

      // Add sort parameter
      if (sortBy) {
        params.append('sort', sortBy);
      }

      console.log('Fetching with params:', Object.fromEntries(params));

      // 🔢 BLOCK ONLY "ONLY NUMBERS" SEARCH TERMS
      const trimmed = searchTerm.trim();
      const onlyNumbers = trimmed !== '' && /^[0-9]+$/.test(trimmed);

      if (onlyNumbers) {
        console.log('Search is only numbers, showing no results');
        setEvents([]);
        setTotalEvents(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5001/api/events?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error('Failed to fetch events');
      }

      const result = await response.json();

      if (result.success) {
        // Transform API data to match frontend format
        let transformedEvents = result.data.map(event => ({
          id: event.apiId,
          name: event.name?.en || event.name?.fi || 'Untitled Event',
          description: event.shortDescription?.en || event.description?.en || '',
          longDescription: event.description?.en || event.shortDescription?.en || '',
          date: event.startTime,
          endDate: event.endTime,
          location: event.location?.name?.en || event.location?.city?.en || 'Helsinki',
          fullLocation: {
            name: event.location?.name?.en || '',
            street: event.location?.streetAddress?.en || '',
            city: event.location?.city?.en || '',
            postalCode: event.location?.postalCode || ''
          },
          image: event.images?.[0]?.url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
          category: event.categories?.[0] || event.keywords?.[0]?.name?.en || '',
          tags: event.categories || [],
          isFree: event.offers?.[0]?.isFree || false,
          ticketPrice: event.offers?.[0]?.isFree ? 'Free Entry' : (event.offers?.[0]?.price?.en || 'Check website'),
          infoUrl: event.infoUrl?.en || '',
          provider: event.provider?.en || '',
          rawData: event
        }));

        // Filter out past events and invalid dates (before 2020)
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today
        const cutoffDate = new Date('2020-01-01');

        transformedEvents = transformedEvents.filter(event => {
          if (!event.date) {
            console.log(`Excluding event with no date: ${event.name}`);
            return false;
          }

          const eventDate = new Date(event.date);

          // Check if date is valid
          if (isNaN(eventDate.getTime())) {
            console.log(`Excluding event with invalid date: ${event.name}`);
            return false;
          }

          // Exclude events before 2020 (likely bad data)
          if (eventDate < cutoffDate) {
            console.log(`Excluding old event: ${event.name} (${event.date})`);
            return false;
          }

          // Compare dates only (not times) - set event date to start of day
          const eventDateOnly = new Date(eventDate);
          eventDateOnly.setHours(0, 0, 0, 0);

          // Show events from today onwards
          const isUpcoming = eventDateOnly >= now;

          if (!isUpcoming) {
            console.log(`Excluding past event: ${event.name} (${event.date})`);
          }

          return isUpcoming;
        });

        console.log(`Filtered to ${transformedEvents.length} valid upcoming events`);

        setEvents(transformedEvents);
        setTotalEvents(result.pagination?.total || 0);
        setTotalPages(result.pagination?.total_pages || 1);

        console.log('Results:', {
          currentPage,
          totalPages: result.pagination?.total_pages,
          totalEvents: result.pagination?.total,
          eventsOnThisPage: transformedEvents.length,
          appliedFilters: filters,
          searchTerm
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      setEvents([]);
      setTotalPages(1);
      setTotalEvents(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page or filters change
  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters, searchTerm]); // Added searchTerm to dependencies

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    // Update URL with search term
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to page 1
    setSearchParams(newParams);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    // Update URL with sort parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    newParams.set('page', '1'); // Reset to page 1
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Update URL with all filters
    const newParams = new URLSearchParams();
    newParams.set('page', '1'); // Reset to page 1

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

    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    // Preserve all existing params and just update page
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1 && !searchTerm && !filters.category && !filters.startDate) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
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
              className={`${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}
            >
              <p className={`${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                Error loading events: {error}. Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator for page changes */}
        {loading && (currentPage > 1 || searchTerm || filters.category || filters.startDate) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searching ? 'Searching...' : 'Loading events...'}
              </p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EventsGrid events={events} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* No Results Message */}
        {!loading && events.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}
              >
                No events found matching your search
              </h3>
              <p className="text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
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
            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing {((currentPage - 1) * EVENTS_PER_PAGE) + 1}-
              {Math.min(currentPage * EVENTS_PER_PAGE, totalEvents)} of {totalEvents} events
              {totalPages > 1 && <span> • Page {currentPage} of {totalPages}</span>}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;
