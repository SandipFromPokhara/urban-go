import { useState, useEffect } from 'react';
import SearchBar from '../components/events/SearchBar';
import EventsGrid from '../components/events/EventsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/events/Pagination';
import { getMockEvents } from '../utils/mockEventsData';
import '../styles/events.css';

const EVENTS_PER_PAGE = 6; // Show 6 events per page

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend first, fallback to mock data
      const response = await fetch('/api/events');
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } else {
        // Use mock data if API fails
        const mockData = getMockEvents();
        setEvents(mockData);
        setFilteredEvents(mockData);
      }
    } catch (err) {
      // Fallback to mock data on error
      console.log('Using mock data:', err.message);
      const mockData = getMockEvents();
      setEvents(mockData);
      setFilteredEvents(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50" style={{ marginTop: '0', paddingTop: '0' }}>
        {/* Animated Hero Section */}
        <div className="hero-section">
          {/* Grid Background */}
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
          />
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EventsGrid events={currentEvents} />
        </div>

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
          <p className="text-center text-gray-600" style={{ color: '#4b5563' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
            {totalPages > 1 && <span> • Page {currentPage} of {totalPages}</span>}
          </p>
        </div>
      </div>
    </>
  );
};

export default EventsList;