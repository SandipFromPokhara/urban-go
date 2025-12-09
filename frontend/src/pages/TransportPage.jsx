// src/pages/TransportPage.jsx

import { useState, useRef } from "react";
import MapSection from "../components/transport/MapSection";
import HeroSection from "../components/transport/HeroSection";
import SearchArea from "../components/transport/SearchArea";
import RightPanel from "../components/transport/RightPanel";
import ServiceDisruption from "../components/transport/ServiceDisruption";
import { useTransAlerts } from "../hooks/useTransAlerts";
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
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const {alerts, loading: alertsLoading } = useTransAlerts();
  const [currentCoords, setCurrentCoords] = useState(null);

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
        const geo = {
          name: "Current location",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setFrom("Current location");
        setCurrentCoords(geo); 
        setSelectedOrigin(geo);
      },
      () => alert("Failed to get location")
    );
  };

  return (
    <main
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Hero Section */}
      <div className="pt-10">
        <HeroSection formRef={formRef} formInputRef={formInputRef} />
      </div>

      {/* Main content section */}
      <section className="relative w-full flex flex-col md:flex-row mt-10 pb-8 gap-8 items-stretch px-4 sm:px-6">
        
        {/* Left Column: SearchArea + RouteList */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <SearchArea
            from={from} setFrom={setFrom}
            to={to} setTo={setTo}
            date={date} setDate={setDate}
            time={time} setTime={setTime}
            routes={routes} setRoutes={setRoutes}
            isDarkMode={isDarkMode}
            ref={formInputRef}
            loading={loading} setLoading={setLoading}
            activeRouteIndex={activeRouteIndex} setActiveRouteIndex={setActiveRouteIndex}
            swapLocations={swapLocations}
            fillCurrentLocation={fillCurrentLocation}
            setSelectedOrigin={setSelectedOrigin}
            currentCoords={currentCoords}
          />
        </div>

        {/* Middle Column: Map */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden shadow-xl/15">
            {loading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-50 flex items-center justify-center">
                <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
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

          <div className="p-4">
            <ServiceDisruption isDarkMode={isDarkMode} alerts={alerts} />
            {alertsLoading && <p className="text-sm opacity-70 mt-2">Loading disruptions...</p>}
          </div>
        </div>
        {/* Right Panel (optional, hidden on mobile) */}
        <div className="w-full flex flex-col md:w-1/3">
          <RightPanel 
            isDarkMode={isDarkMode}
            co2={routes[activeRouteIndex]?.co2}
            ticketInfo={routes[activeRouteIndex]?.ticketInfo}
            alerts={[]}
          />
          </div>
      </section>
    </main>
  );
}

export default TransportPage;
