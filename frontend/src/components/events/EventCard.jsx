import { Calendar, MapPin, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { getEventRatings } from "../../hooks/ratings";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const EventCard = ({ event, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [averageRating, setAverageRating] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRatings = async () => {
      const { averageRating } = await getEventRatings(event.id, token);
      setAverageRating(averageRating);
    };
    fetchRatings();
  }, [event.id, token]);

  const handleEventClick = () => {
    const currentSearch = location.search;
    navigate(`/events/${event.id}`, {
      state: { fromSearch: currentSearch },
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(event);
  };

  //  Normalize location names
  const normalizeLocation = (location) => {
    if (!location) return 'Location TBA';
    
    const locationLower = location.toLowerCase().trim();
    
    if (locationLower === 'internet') {
      return 'Online';
    }
    
    return location;
  };

  // SMART DATE CALCULATION
  const calculateSmartDate = (startDate, endDate) => {
    if (!startDate) return { dateStr: "Date TBA", timeStr: null, isNextOccurrence: false };

    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    // Check if event is ongoing 
    const isOngoing = start < now && (!end || end > now);

    let displayDate = start;
    let isNextOccurrence = false;

    if (isOngoing) {
      // Event is ongoing - calculate next occurrence
      const dayOfWeek = start.getDay();
      const startHour = start.getHours();
      const startMinute = start.getMinutes();

      // Find next occurrence of the same day of week
      const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7;
      
      const nextOccurrence = new Date(now);
      nextOccurrence.setDate(now.getDate() + daysUntilNext);
      nextOccurrence.setHours(startHour, startMinute, 0, 0);

      // If the calculated time already passed today, move to next week
      if (nextOccurrence <= now) {
        nextOccurrence.setDate(nextOccurrence.getDate() + 7);
      }

      displayDate = nextOccurrence;
      isNextOccurrence = true;
    }

    // Format the date
    const dateStr = displayDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    // Check if time matches all-day patterns
    const hour = displayDate.getHours();
    const minute = displayDate.getMinutes();
    
    // Get end time if available
    let endHour = null;
    let endMinute = null;
    if (endDate) {
      const end = new Date(endDate);
      endHour = end.getHours();
      endMinute = end.getMinutes();
    }
    
    // Detect all-day patterns:
    // Pattern 1: 00:00 (midnight)
    // Pattern 2: 00:01 - 23:59 (full day)
    // Pattern 3: 00:00 - 23:59 (midnight to end)
    const isAllDay = 
      (hour === 0 && minute === 0) || // 00:00
      (hour === 0 && minute === 1 && endHour === 23 && endMinute === 59) || // 00:01 - 23:59
      (hour === 0 && minute === 0 && endHour === 23 && endMinute === 59); // 00:00 - 23:59

    // Show "All day" text for all-day events, otherwise show time
    const timeStr = isAllDay 
      ? 'All day' 
      : displayDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });

    return { dateStr, timeStr, isNextOccurrence };
  };

  const { dateStr, timeStr, isNextOccurrence } = calculateSmartDate(event.date, event.endDate);

  return (
    <div
      onClick={handleEventClick}
      className={`max-w-[480px] w-full mx-auto ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full`}
    >
      {/* Image */}
      <div
        className={`relative h-48 overflow-hidden ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400";
          }}
        />

        {event.category && (
          <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        )}

        {/* Only show "Ongoing" badge for truly ongoing events */}
        {event.endDate && !isNextOccurrence && (
          <span 
            className="absolute bottom-3 right-3 text-white px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#10b981" }}
          >
            Ongoing
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

      {/* Content */}
      <div className="p-4 grow flex flex-col">
        <h3
          className={`text-xl font-bold mb-2 line-clamp-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {event.name}
        </h3>

        <p
          className={`text-sm mb-3 line-clamp-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          {/* Clean date display - always show date and time */}
          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm">
              {dateStr}
              {timeStr && (
                <span 
                  className="ml-2 font-medium" 
                  style={{ color: timeStr === 'All day' ? '#10b981' : '#2563eb' }}
                >
                  {timeStr === 'All day' ? '• All day' : `@ ${timeStr}`}
                </span>
              )}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{normalizeLocation(event.location)}</span>
          </div>
        </div>

        {/* Footer pinned to bottom: stars + button */}
        <div className="mt-auto">
          <StarRating rating={averageRating} isDarkMode={isDarkMode} />

          <button
            className="w-full py-2 rounded-lg font-medium transition-colors mt-3"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick();
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;