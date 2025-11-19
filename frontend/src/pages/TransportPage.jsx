// TransportPage.jsx
import { useState, useRef } from "react";
import MapSection from "../components/transport/MapSection";
import HeroSection from "../components/transport/HeroSection";
import SearchArea from "../components/transport/SearchArea";
import RouteList from "../components/transport/RouteList";
import LeftPanel from "../components/transport/LeftPanel";
import RightPanel from "../components/transport/RightPanel";
import "leaflet/dist/leaflet.css";

function TransportPage({ isDarkMode }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState([]);
  const [mapStyle, setMapStyle] = useState("street");
  const [loading, setLoading] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(null);
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
      (pos) => setFrom(`${pos.coords.latitude}, ${pos.coords.longitude}`),
      () => alert("Failed to get location")
    );
  };

  return (
    <main
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div className="pt-10">
        <HeroSection formRef={formRef} formInputRef={formInputRef} />
      </div>

      {/* Body Section with flexible side panels */}
      <section className="relative w-full flex flex-col md:flex-row mt-6 pb-8 gap-6 items-stretch">
        {/* Left Side Panel */}
        <LeftPanel setFrom={setFrom} setTo={setTo} formRef={formRef} isDarkMode={isDarkMode} />

        {/* Main content: Search + RouteList + Map */}
        <div
          ref={formRef}
          className="flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6 items-stretch"
        >
          {/* Left Column: SearchArea + RouteList */}
          <div className="w-full md:w-2/5 flex flex-col gap-6 pt-2">
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

            {routes.length > 0 && (
              <RouteList
                routes={routes}
                isDarkMode={isDarkMode}
                activeRouteIndex={activeRouteIndex}
                setActiveRouteIndex={setActiveRouteIndex}
              />
            )}
          </div>

          {/* Right Column: Map */}
          <div className="w-full md:w-3/5 flex flex-col pt-2 h-auto">
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
              setActiveRouteIndex={setActiveRouteIndex}
            />
          </div>
        </div>

        {/* Right Side Panel */}
        <RightPanel isDarkMode={isDarkMode} />
      </section>
    </main>
  );
}

export default TransportPage;
