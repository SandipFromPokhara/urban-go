import { Calendar, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/favoritesContext";

const FavoriteCard = ({ event }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleEventClick = () => {
    navigate(`/events/${event.id || event.eventId}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(event);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      onClick={handleEventClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl w-72"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400";
          }}
        />

        {/* Category */}
        {event.category && (
          <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        )}

        {/* Heart Button */}
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
          className="w-full py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
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
  );
};

export default FavoriteCard;
