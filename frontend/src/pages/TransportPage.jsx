// TransportPage.jsx
import { useState, useRef } from "react";
import MapSection from "../components/transport/MapSection";
import HeroSection from "../components/transport/HeroSection";
import SearchArea from "../components/transport/SearchArea";
import RouteList from "../components/transport/RouteList";
import "leaflet/dist/leaflet.css";

function TransportPage({ isDarkMode }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState([]);
  const [mapStyle, setMapStyle] = useState("street");
  const [loading, setLoading] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(null);     // Track active route
  const formRef = useRef(null);
  const formInputRef = useRef(null);

  // Swap logic
  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Geolocation fill
  const fillCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFrom(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      },
      (err) => {
        alert("Failed to get location");
      }
    );
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Hero Section */}
      <div className="pt-20"> {/* 80px header height */}
        <HeroSection formRef={formRef} formInputRef={formInputRef} />
      </div>

      {/* Body */}
      <section
        ref={formRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex flex-col md:flex-row gap-6"
      >
        {/* Left Column: Search Area */}
        <div className="w-full md:w-2/5 flex flex-col gap-6">
          <SearchArea
            from={from} setFrom={setFrom}
            to={to} setTo={setTo}
            date={date} setDate={setDate}
            time={time} setTime={setTime}
            routes={routes} setRoutes={setRoutes}
            isDarkMode={isDarkMode}
            formInputRef={formInputRef}
            loading={loading} setLoading={setLoading}
            activeRouteIndex={activeRouteIndex} setActiveRouteIndex={setActiveRouteIndex}
            swapLocations={swapLocations}           
            fillCurrentLocation={fillCurrentLocation}                    
          />
        </div>
          
          {/* Right Column: Map */}
          <div className="w-full md:w-3/5 h-[400px] md:h-[500px] lg:h-[600px]">
            {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-50 flex items-center justify-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          )}

          <MapSection
            routes={routes}
            isDarkMode={isDarkMode}
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
            activeRouteIndex={activeRouteIndex}
            setActiveRouteIndex={setActiveRouteIndex}     // Map updates active route on marker click
          />
          </div>
      </section>
    </main>
  );
}

export default TransportPage;
