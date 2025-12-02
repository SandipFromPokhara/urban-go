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
import { useFavorites } from "../context/FavoritesContext";
import CommentSection from "../components/events/CommentSection";
import { getEventRatings, postRating } from "../hooks/ratings";
import { jwtDecode } from "jwt-decode";

const EventDetails = ({ isDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  // Get the full search params user came from (includes page, filters, etc.)
  const fromSearch = location.state?.fromSearch || "?page=1";
  const getToken = () => localStorage.getItem("authToken");
  const token = getToken();
  let loggedIn = null;

  if (token) {
    try {
      loggedIn = jwtDecode(token);
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }

  useEffect(() => {
    const fetchRatings = async () => {
      const { averageRating, userRating } = await getEventRatings(id, token);
      setAverageRating(averageRating);
      setUserRating(userRating);
    };
    fetchRatings();
  }, [id, token]);

  const handleRating = async (rating) => {
    if (!getToken()) {
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
        
        if (!response.ok) {
          throw new Error("Event not found");
        }

        const result = await response.json();

        if (result.success && result.data) {
          const apiEvent = result.data;

          // Transform API data to match frontend format
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
            ticketPrice: apiEvent.offers?.[0]?.isFree
              ? "Free Entry"
              : apiEvent.offers?.[0]?.price?.en || "Check website for pricing",
            isFree: apiEvent.offers?.[0]?.isFree || false,
            infoUrl:
              apiEvent.infoUrl?.en || apiEvent.offers?.[0]?.infoUrl?.en || "",
            keywords:
              apiEvent.keywords?.map((kw) => kw.name?.en).filter(Boolean) || [],
          };

          setEvent(transformedEvent);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime) return "Time TBA";

    const start = new Date(startTime);
    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!endTime) return startTimeStr;

    const end = new Date(endTime);
    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${startTimeStr} - ${endTimeStr}`;
  };

  const handleBack = () => {
    // Navigate back with all the filters and page the user came from
    navigate(`/events${fromSearch}`);
  };

  const handlePlanRoute = () => {
    navigate("/transportation");
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(event);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleVisitWebsite = () => {
    if (event.infoUrl) {
      window.open(event.infoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error || "Event not found"}
          </p>
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
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      style={{ paddingTop: "5rem" }}
    >
      {/* Event Header Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

        {/* Action Buttons */}
        <div
          className="absolute top-4 right-4 flex gap-2"
          style={{ zIndex: 10 }}
        >
          <button
            onClick={handleFavoriteClick}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: isFavorite(event.id) ? "#ef4444" : "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Heart
              style={{
                color: isFavorite(event.id) ? "#ffffff" : "#374151",
                fill: isFavorite(event.id) ? "#ffffff" : "none",
                width: "20px",
                height: "20px",
              }}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Share2
              style={{
                color: "#374151",
                width: "20px",
                height: "20px",
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
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md p-6`}
            >
              {/* Category Badge */}
              {event.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
              )}

              {/* Free Entry Badge */}
              {event.isFree && (
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4 ml-2">
                  Free Entry
                </span>
              )}

              <h1
                className={`text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {event.name}
              </h1>

              <p
                className={`text-lg mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {event.description}
              </p>

              <div
                className={`border-t pt-6 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  About This Event
                </h2>
                <div
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: event.longDescription.replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              {/* Keywords/Tags */}
              {event.keywords && event.keywords.length > 0 && (
                <div
                  className={`border-t pt-6 mt-6 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.keywords.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md p-6 sticky top-4`}
            >
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Event Information
              </h3>

              <div className="space-y-5">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar
                    className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                    style={{ color: "#2563eb" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Date
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock
                    className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                    style={{ color: "#2563eb" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Time
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin
                    className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                    style={{ color: "#2563eb" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Location
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.location}
                    </p>
                    {event.fullAddress && (
                      <p
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {event.fullAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-start gap-3">
                  <Users
                    className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
                    style={{ color: "#2563eb" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold mb-1 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Organizer
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.organizer}
                    </p>
                  </div>
                </div>
                {/* User Rating */}
                <div className="flex items-start gap-3">
                  <p
                    className={`font-semibold mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
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
                    <span
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } ml-2`}
                    >
                      {userRating ? `${userRating} stars` : "No rating yet"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Price */}
              <div
                className={`mt-6 pt-6 border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-sm mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Ticket Price
                </p>
                <p
                  className="text-2xl font-bold text-blue-600"
                  style={{ color: "#2563eb" }}
                >
                  {event.ticketPrice}
                </p>
              </div>

              <div className="mt-2">
                <strong>Average Rating:</strong>{" "}
                {averageRating ? averageRating.toFixed(1) : "No rating yet"}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {/* Buy Ticket Button - Only for paid events */}
                {!event.isFree && event.infoUrl && (
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

                {/* Visit Website Button - Only for free events or if no ticket link */}
                {event.isFree && event.infoUrl && (
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

                {/* Plan Route Button */}
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

      {/* Back to Events Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 transition-colors"
              style={{
                color: "#ffffff",
                backgroundColor: "#6366f1",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "0",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#4f46e5")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6366f1")}
            >
              <ArrowLeft
                style={{ width: "20px", height: "20px", color: "#ffffff" }}
              />
              <span style={{ color: "#ffffff" }}>Back to Events</span>
            </button>
              <CommentSection
                apiId={event.id}
                currentUser={loggedIn}
                isDarkMode={isDarkMode}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
