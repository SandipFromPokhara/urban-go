import { useState, useEffect } from "react"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  Users,
  ExternalLink,
  Star,
} from "lucide-react";
import { useFavorites } from "../context/favoritesContext";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/events/CommentSection";
import { getEventRatings, postRating } from "../hooks/ratings";
import { motion } from "framer-motion";

const EventDetails = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorited, add, remove } = useFavorites();
  const { user, token } = useAuth();
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const fromSearch = location.state?.fromSearch || "?page=1";

  useEffect(() => {
    const fetchRatings = async () => {
      const { averageRating, userRating } = await getEventRatings(id, token);
      setAverageRating(averageRating);
      setUserRating(userRating);
    };
    fetchRatings();
  }, [id, token]);

  const handleRating = async (rating) => {
    if (!token) {
      return alert("You must be logged in to rate events");
    }
    const { averageRating: newAverage } = await postRating(id, rating, token);
    setUserRating(rating);
    setAverageRating(newAverage);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5001/api/events/${id}?language=en`);
        if (!response.ok) throw new Error("Event not found");

        const result = await response.json();
        if (!result.success || !result.data) throw new Error("Invalid response format");

        const apiEvent = result.data;

        const firstOffer = apiEvent.offers?.[0];

        let ticketPrice = firstOffer?.isFree
          ? "Free Entry"
          : firstOffer?.price?.en || "Check website for pricing";

        let infoUrl =
          apiEvent.infoUrl?.en || firstOffer?.infoUrl?.en || "";

        const looksLikeUrl = ticketPrice && /https?:\/\//i.test(ticketPrice);
        if (looksLikeUrl) {
          if (!infoUrl) infoUrl = ticketPrice.trim();
          ticketPrice = "Check website for pricing";
        }

        const transformedEvent = {
          id: apiEvent.apiId,
          name: apiEvent.name?.en || apiEvent.name?.fi || "Untitled Event",
          description:
            apiEvent.shortDescription?.en || apiEvent.description?.en || "",
          longDescription:
            apiEvent.description?.en ||
            apiEvent.shortDescription?.en ||
            "No description available.",
          date: apiEvent.startTime,
          endDate: apiEvent.endTime,
          time: formatTimeRange(apiEvent.startTime, apiEvent.endTime),
          location:
            apiEvent.location?.name?.en ||
            apiEvent.location?.city?.en ||
            "Helsinki",
          fullAddress: [
            apiEvent.location?.streetAddress?.en,
            apiEvent.location?.city?.en,
            apiEvent.location?.postalCode,
          ]
            .filter(Boolean)
            .join(", "),
          image:
            apiEvent.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
          category:
            apiEvent.categories?.[0] ||
            apiEvent.keywords?.[0]?.name?.en ||
            "",
          tags: apiEvent.categories || [],
          organizer:
            apiEvent.provider?.en || apiEvent.publisher || "Event Organizer",
          ticketPrice,
          isFree: firstOffer?.isFree || false,
          infoUrl,
          keywords:
            apiEvent.keywords?.map((kw) => kw.name?.en).filter(Boolean) || [],
        };

        setEvent(transformedEvent);

      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // SMART DATE CALCULATION for ongoing events
  const calculateSmartDate = (startDate, endDate) => {
    if (!startDate) return null;

    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const isOngoing = start < now && (!end || end > now);

    if (isOngoing) {
      // Calculate next occurrence 
      const dayOfWeek = start.getDay();
      const startHour = start.getHours();
      const startMinute = start.getMinutes();

      const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7;
      
      const nextOccurrence = new Date(now);
      nextOccurrence.setDate(now.getDate() + daysUntilNext);
      nextOccurrence.setHours(startHour, startMinute, 0, 0);

      if (nextOccurrence <= now) {
        nextOccurrence.setDate(nextOccurrence.getDate() + 7);
      }

      return nextOccurrence;
    }

    return start;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime) return "Time TBA";

    const start = new Date(startTime);
    const startHour = start.getHours();
    const startMinute = start.getMinutes();

    // Check for common all-day patterns
    if (!endTime) {
   
      if (startHour === 0 && startMinute === 0) {
        return "All day";
      }
    } else {
      const end = new Date(endTime);
      const endHour = end.getHours();
      const endMinute = end.getMinutes();
      
      // Pattern 1: 00:00 - 00:00 
      if (startHour === 0 && startMinute === 0 && endHour === 0 && endMinute === 0) {
        return "All day";
      }
      
      // Pattern 2: 00:01 - 23:59 
      if (startHour === 0 && startMinute === 1 && endHour === 23 && endMinute === 59) {
        return "All day";
      }
      
      // Pattern 3: 00:00 - 23:59
      if (startHour === 0 && startMinute === 0 && endHour === 23 && endMinute === 59) {
        return "All day";
      }
    }

    const startStr = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!endTime) return startStr;

    const end = new Date(endTime);
    const endStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${startStr} - ${endStr}`;
  };

  // UPDATED: Format date with smart calculation
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Normalize location names
  const normalizeLocation = (location) => {
    if (!location) return 'Location TBA';
    
    const locationLower = location.toLowerCase().trim();
    
    if (locationLower === 'internet') {
      return 'Online';
    }
    
    return location;
  };

  const handleBack = () => navigate(`/events${fromSearch}`);
  const handlePlanRoute = () => navigate("/transportation");

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleVisitWebsite = () => {
    if (event.infoUrl) {
      window.open(event.infoUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {error || "Event not found"}
          </p>
          <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
            Back to Events
          </button>
        </div>
      </div>
    );
  }
  const favorite = isFavorited(event.id);

  //Calculate smart dates for display
  const smartStartDate = calculateSmartDate(event.date, event.endDate);
  const now = new Date();
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : null;
  const isOngoing = start < now && (!end || end > now);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`} style={{ paddingTop: "5rem" }}>

      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-4 right-4 flex gap-2" style={{ zIndex: 10 }}>
          <motion.button
            onClick={handleFavoriteClick}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: favorite ? "#ef4444" : "#ffffff",
            }}
          >
            <motion.div
              animate={{
                scale: favorite ? [1, 1.4, 1] : [1, 0.8, 1],
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <Heart
                style={{
                  color: favorite ? "#ffffff" : "#374151",
                  fill: favorite ? "#ffffff" : "none",
                }}
              />
            </motion.div>
          </motion.button>

          <button
            onClick={handleShare}
            className="p-3 rounded-full shadow-lg bg-white"
          >
            <Share2 style={{ color: "#374151", width: "20px", height: "20px" }} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>

              <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {event.name}
              </h1>

              <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {event.description}
              </p>

              <div className={`border-t pt-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>About This Event</h2>

                <div
                  className={`leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  dangerouslySetInnerHTML={{
                    __html: event.longDescription.replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              {event.keywords.length > 0 && (
                <div className={`border-t pt-6 mt-6 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.keywords.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 sticky top-4`}>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Event Information
              </h3>

              <div className="space-y-5">
                
                {/*show the calculated date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Date
                    </p>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {formatDate(smartStartDate)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Time
                    </p>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {event.time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Location
                    </p>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {normalizeLocation(event.location)}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {event.fullAddress}
                    </p>
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Organizer
                    </p>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {event.organizer}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Your Rating
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-6 h-6 cursor-pointer ${
                          n <= (hoverRating || userRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRating(n)}
                      />
                    ))}
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {userRating ? `${userRating} stars` : "No rating yet"}
                    </span>
                  </div>
                </div>

              </div>

              <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Ticket Price
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {event.ticketPrice}
                </p>
              </div>

              <div className="mt-2">
                <strong>Average Rating:</strong>{" "}
                {averageRating ? averageRating.toFixed(1) : "No rating yet"}
              </div>

              <div className="mt-6 space-y-3">
                
                {(event.isFree || event.ticketPrice === "Check website for pricing") && event.infoUrl && (
                  <button
                    onClick={handleVisitWebsite}
                    className="w-full py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1d4ed8")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#2563eb")
                    }
                  >
                    Visit Website
                    <ExternalLink style={{ width: "16px", height: "16px" }} />
                  </button>
                )}

                {!event.isFree &&
                  event.ticketPrice !== "Check website for pricing" &&
                  event.infoUrl && (
                    <button
                      onClick={handleVisitWebsite}
                      className="w-full py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "#16a34a",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#15803d")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#16a34a")
                      }
                    >
                      Buy Ticket
                      <ExternalLink style={{ width: "16px", height: "16px" }} />
                    </button>
                  )}

                <button
                  onClick={handlePlanRoute}
                  className="w-full py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: "transparent",
                    color: "#2563eb",
                    border: "2px solid #2563eb",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Plan Route
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Events
            </button>

            <CommentSection
              apiId={event.id}
              currentUser={user}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventDetails;