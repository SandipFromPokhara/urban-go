import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getMockEvents = () => [
    {
      id: '1',
      name: 'Helsinki Music Festival',
      date: '2025-12-15',
      location: 'Helsinki Music Centre',
      description: 'Annual classical music festival featuring international artists',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
      category: 'Music'
    },
    {
      id: '2',
      name: 'Art Exhibition: Nordic Lights',
      date: '2025-12-20',
      location: 'Kiasma Museum',
      description: 'Contemporary art exhibition showcasing Nordic artists',
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
      category: 'Art'
    },
    {
      id: '3',
      name: 'Winter Food Market',
      date: '2025-12-10',
      location: 'Old Market Hall',
      description: 'Traditional Finnish winter delicacies and local crafts',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      category: 'Food'
    },
    {
      id: '4',
      name: 'Tech Meetup Helsinki',
      date: '2025-12-18',
      location: 'Maria 01 Startup Campus',
      description: 'Monthly gathering for tech enthusiasts and developers',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      category: 'Technology'
    },
    {
      id: '5',
      name: 'Christmas Market',
      date: '2025-12-05',
      location: 'Senate Square',
      description: 'Traditional Christmas market with crafts, food, and entertainment',
      image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400',
      category: 'Festival'
    },
    {
      id: '6',
      name: 'Jazz Night at Storyville',
      date: '2025-12-22',
      location: 'Storyville Jazz Club',
      description: 'Evening of smooth jazz with local and international performers',
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
      category: 'Music'
    }
  ];

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-blue-100">Explore exciting events happening in Helsinki region</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: '#111827' }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white placeholder-gray-400"
              />
            </div>
            
            {/* Filter Button - Placeholder for future functionality */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400';
                    }}
                  />
                  {event.category && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 pb-4">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <p className="text-center text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>
    </div>
  );
};

export default EventsList;