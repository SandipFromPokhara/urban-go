import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Heart, Share2, Users } from 'lucide-react';
import { getMockEvents } from '../utils/mockEventsData';

const EventDetails = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          const mockEvent = getMockEventById(id);
          setEvent(mockEvent);
        }
      } catch (err) {
        console.log('Using mock data:', err.message);
        const mockEvent = getMockEventById(id);
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const getMockEventById = (eventId) => {
    const allEvents = getMockEvents();
    
    // Convert eventId from URL (string) to number
    const numericId = parseInt(eventId, 10);
    
    // Find the event with matching ID
    const foundEvent = allEvents.find(event => event.id === numericId);
    
    // Add extra properties for detail page if needed
    if (foundEvent) {
      return {
        ...foundEvent,
        time: '10:00 - 18:00',
        longDescription: foundEvent.description,
        organizer: 'Event Organizer',
        capacity: 200,
        ticketPrice: 'Free Entry',
      };
    }
    
    // Fallback to first event if not found
    return allEvents[0];
  };

  const handleBack = () => {
    navigate('/events');
  };

  const handlePlanRoute = () => {
    console.log('Plan Route clicked'); // Debug log
    navigate('/transportation');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    alert('Share functionality coming soon!');
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Event not found</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ paddingTop: '5rem' }}>
      {/* Event Header Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2" style={{ zIndex: 10 }}>
          <button
            onClick={handleFavorite}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: isFavorite ? '#ef4444' : '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Heart
              style={{
                color: isFavorite ? '#ffffff' : '#374151',
                fill: isFavorite ? '#ffffff' : 'none',
                width: '20px',
                height: '20px'
              }}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{ 
              backgroundColor: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Share2 
              style={{ 
                color: '#374151',
                width: '20px',
                height: '20px'
              }}
            />
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              {/* Category Badge */}
              {event.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
              )}

              <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {event.name}
              </h1>

              <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {event.description}
              </p>

              <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>About This Event</h2>
                <p className={`leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {event.longDescription}
                </p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className={`border-t pt-6 mt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-4`}>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Event Information</h3>

              <div className="space-y-5">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" style={{ color: '#2563eb' }} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Date</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(event.date)}</p>
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" style={{ color: '#2563eb' }} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Time</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.time}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" style={{ color: '#2563eb' }} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Location</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.location}</p>
                  </div>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" style={{ color: '#2563eb' }} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Organizer</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket Price */}
              {event.ticketPrice && (
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ticket Price</p>
                  <p className="text-2xl font-bold text-blue-600" style={{ color: '#2563eb' }}>{event.ticketPrice}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button 
                  className="w-full py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Get Tickets
                </button>
                <button 
                  onClick={handlePlanRoute}
                  className="w-full py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    border: '2px solid #2563eb',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Plan Route
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Events Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 transition-colors"
              style={{ 
                color: '#ffffff',
                backgroundColor: '#6366f1',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '0'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
            >
              <ArrowLeft style={{ width: '20px', height: '20px', color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>Back to Events</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;