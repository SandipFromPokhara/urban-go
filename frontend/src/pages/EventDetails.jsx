import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Heart, Share2, Users } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

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

  const getMockEventById = (eventId) => {
    const mockEvents = {
      '1': {
        id: '1',
        name: 'Helsinki Music Festival',
        date: '2025-12-15',
        time: '18:00 - 22:00',
        location: 'Helsinki Music Centre',
        address: 'Mannerheimintie 13, 00100 Helsinki',
        description: 'Join us for an unforgettable evening of classical music featuring world-renowned artists from across Europe. This annual festival has been bringing the finest musical performances to Helsinki for over 20 years.',
        longDescription: 'The Helsinki Music Festival is one of the most prestigious classical music events in Northern Europe. This year\'s program features performances by internationally acclaimed orchestras and soloists. Experience the magic of live classical music in the stunning acoustics of the Helsinki Music Centre. The evening will include works by Sibelius, Rachmaninoff, and contemporary Finnish composers.',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        category: 'Music',
        organizer: 'Helsinki Philharmonic Orchestra',
        capacity: 500,
        ticketPrice: '€35 - €85',
        tags: ['Classical', 'Orchestra', 'Concert']
      },
      '2': {
        id: '2',
        name: 'Art Exhibition: Nordic Lights',
        date: '2025-12-20',
        time: '10:00 - 18:00',
        location: 'Kiasma Museum',
        address: 'Mannerheiminaukio 2, 00100 Helsinki',
        description: 'Contemporary art exhibition showcasing Nordic artists and their interpretation of light in Nordic landscapes.',
        longDescription: 'Nordic Lights is a groundbreaking exhibition exploring how contemporary Nordic artists interpret and represent the unique quality of light in the northern regions. Featuring works from Finland, Sweden, Norway, Denmark, and Iceland, this exhibition offers a fresh perspective on Nordic contemporary art.',
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
        category: 'Art',
        organizer: 'Kiasma Museum',
        capacity: 200,
        ticketPrice: '€15 - €25',
        tags: ['Art', 'Exhibition', 'Contemporary']
      },
      '3': {
        id: '3',
        name: 'Winter Food Market',
        date: '2025-12-10',
        time: '11:00 - 19:00',
        location: 'Old Market Hall',
        address: 'Eteläranta, 00130 Helsinki',
        description: 'Traditional Finnish winter delicacies and local crafts in a festive market setting.',
        longDescription: 'Experience authentic Finnish flavors at the Winter Food Market. Local vendors showcase traditional winter delicacies, from hearty soups to freshly baked pastries. Browse handmade crafts and enjoy the warm, festive atmosphere of this beloved annual event.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        category: 'Food',
        organizer: 'Helsinki Food Markets Association',
        capacity: 1000,
        ticketPrice: 'Free Entry',
        tags: ['Food', 'Market', 'Traditional']
      },
      '4': {
        id: '4',
        name: 'Tech Meetup Helsinki',
        date: '2025-12-18',
        time: '17:00 - 20:00',
        location: 'Maria 01 Startup Campus',
        address: 'Lapinlahdenkatu 16, 00180 Helsinki',
        description: 'Monthly gathering for tech enthusiasts and developers',
        longDescription: 'Join fellow developers and tech enthusiasts for an evening of networking, learning, and innovation. This month features talks on AI, web development, and startup culture in Finland.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: 'Technology',
        organizer: 'Helsinki Tech Community',
        capacity: 150,
        ticketPrice: 'Free',
        tags: ['Technology', 'Networking', 'Meetup']
      },
      '5': {
        id: '5',
        name: 'Christmas Market',
        date: '2025-12-05',
        time: '10:00 - 20:00',
        location: 'Senate Square',
        address: 'Senaatintori, 00170 Helsinki',
        description: 'Traditional Christmas market with crafts, food, and entertainment',
        longDescription: 'Experience the magic of Christmas at Helsinki\'s most beloved holiday market. Shop for handcrafted gifts, enjoy traditional Finnish treats, and immerse yourself in the festive atmosphere.',
        image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800',
        category: 'Festival',
        organizer: 'City of Helsinki',
        capacity: 5000,
        ticketPrice: 'Free Entry',
        tags: ['Festival', 'Christmas', 'Market']
      },
      '6': {
        id: '6',
        name: 'Jazz Night at Storyville',
        date: '2025-12-22',
        time: '20:00 - 23:30',
        location: 'Storyville Jazz Club',
        address: 'Museokatu 8, 00100 Helsinki',
        description: 'Evening of smooth jazz with local and international performers',
        longDescription: 'Experience an intimate evening of live jazz at one of Helsinki\'s most iconic venues. Tonight\'s lineup features both emerging local talent and established international artists.',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        category: 'Music',
        organizer: 'Storyville Jazz Club',
        capacity: 80,
        ticketPrice: '€25',
        tags: ['Jazz', 'Music', 'Live Performance']
      }
    };

    return mockEvents[eventId] || mockEvents['1'];
  };

  const handleBack = () => {
    navigate('/events');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Event not found</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 transition-colors"
            style={{ 
              color: '#4b5563',
              backgroundColor: 'transparent',
              border: 'none'
            }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#4b5563' }} />
            <span style={{ color: '#4b5563' }}>Back to Events</span>
          </button>
        </div>
      </div>

      {/* Event Header Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleFavorite}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: isFavorite ? '#ef4444' : '#ffffff',
              border: 'none'
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
              border: 'none'
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
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Category Badge */}
              {event.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
              )}

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.name}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {event.description}
              </p>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - FIXED LAYOUT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Information</h3>

              <div className="space-y-5">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Date</p>
                    <p className="text-gray-700 text-sm">{formatDate(event.date)}</p>
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Time</p>
                      <p className="text-gray-700 text-sm">{event.time}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Location</p>
                    <p className="text-gray-700 text-sm">{event.location}</p>
                    {event.address && (
                      <p className="text-gray-600 text-sm mt-1">{event.address}</p>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Organizer</p>
                      <p className="text-gray-700 text-sm">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket Price */}
              {event.ticketPrice && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Ticket Price</p>
                  <p className="text-2xl font-bold text-blue-600">{event.ticketPrice}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button 
                  className="w-full py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Get Tickets
                </button>
                <button 
                  className="w-full py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    border: '2px solid #2563eb'
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
    </div>
  );
};

export default EventDetails;