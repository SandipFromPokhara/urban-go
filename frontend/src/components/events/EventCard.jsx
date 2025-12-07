import { Calendar, MapPin, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../../context/favoritesContext";
import { getEventRatings } from "../../hooks/ratings";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

const EventCard = ({ event, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorited, add, remove } = useFavorites();
  const [averageRating, setAverageRating] = useState(0);

  const token = localStorage.getItem("authToken");

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

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      if (isFavorited(event.id)) {
        await remove(event.id);
      } else {
        await add(event.id);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const formatDateRange = (start, end) => {
    if (!start) return "Date TBA";

    const opts = { year: "numeric", month: "long", day: "numeric" };
    const startStr = new Date(start).toLocaleDateString("en-US", opts);

    if (!end) return startStr;

    const endStr = new Date(end).toLocaleDateString("en-US", opts);
    return `${startStr} – ${endStr}`;
  };

  return (
    <div
      onClick={handleEventClick}
      className={`${
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

        {event.endDate && (
          <span className="absolute bottom-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Ongoing
          </span>
        )}

        <motion.button
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 p-2 rounded-full"
          style={{
            backgroundColor: isFavorited(event.id) ? "#ef4444" : "#ffffff",
          }}
        >
          <motion.div
            animate={{
              scale: isFavorited(event.id) ? [1, 1.4, 1] : [1, 0.8, 1],
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Heart
              style={{
                color: isFavorited(event.id) ? "#ffffff" : "#374151",
                fill: isFavorited(event.id) ? "#ffffff" : "none",
              }}
            />
          </motion.div>
        </motion.button>
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
          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm">
              {formatDateRange(event.date, event.endDate)}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{event.location}</span>
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
