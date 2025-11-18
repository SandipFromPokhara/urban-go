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
        {/* Page Header Section */}
        <div style={{ 
          background: 'linear-gradient(175deg, #5A8CFF 0%, #8A4FF6 30%, #B33EF0 65%, #FF4CA8 100%)',
          color: 'white',
          marginTop: '2rem', 
          marginBottom: '0', 
          paddingTop: '4rem', 
          paddingBottom: '3rem' 
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
              Discover Events
            </h1>
            <p className="text-xl" style={{ color: '#e0e7ff' }}>
              Explore exciting events happening in Helsinki region
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

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