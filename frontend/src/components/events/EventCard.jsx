import { Calendar, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { Heart } from 'lucide-react';

const EventCard = ({ event, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  

  const handleEventClick = () => {
    // Save the entire current URL search params (includes page, filters, search, etc.)
    const currentSearch = location.search;
    
    // Navigate to event details and pass the full search params
    navigate(`/events/${event.id}`, { 
      state: { fromSearch: currentSearch } 
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(event);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div
      onClick={handleEventClick}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full`}
    >
      {/* Event Image */}
      <div className={`relative h-48 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 p-2 rounded-full"
          style={{
            backgroundColor: isFavorite(event.id || event.eventId)
              ? "#ef4444"
              : "#ffffff",
            border: "none",
          }}
        >
          <Heart
            style={{
              width: 20,
              height: 20,
              color: isFavorite(event.id || event.eventId) ? "#fff" : "#374151",
              fill: isFavorite(event.id || event.eventId) ? "#fff" : "none",
            }}
          />
        </button>
      </div>

      {/* Event Details */}
      <div className="p-4 grow flex flex-col">
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {event.name}
        </h3>
        
        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        {/* Card Footer - Pushed to bottom */}
        <div className="mt-auto">
          <button 
            className="w-full py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick();
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;