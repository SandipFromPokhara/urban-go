// TransportPage.jsx
import { useState, useRef } from "react";
import MapSection from "../components/transport/MapSection";
import HeroSection from "../components/transport/HeroSection";
import SearchArea from "../components/transport/SearchArea";
import RouteList from "../components/transport/Routelist";
import "leaflet/dist/leaflet.css";

function TransportPage({ isDarkMode }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState([]);
  const [mapStyle, setMapStyle] = useState("street");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const formInputRef = useRef(null);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });

      // Focus after the next paint
      const focusInput = () => {
        formInputRef.current?.focus();
      };

      // Use requestAnimationFrame to ensure the input exists and is visible
      requestAnimationFrame(() => {
        setTimeout(focusInput, 200); // small delay for smooth scroll
      });
  }
};

  return (
    <main className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Hero Section */}
      <HeroSection />

      {/* Optional top CTA scroll button */}
      <div className="text-center mt-4">
        <button
          onClick={handleScrollToForm}
          className="bg-linear-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 
                     font-semibold py-2 px-4 rounded-lg transition-all ease-in-out hover:shadow-lg"
        >
          Plan Your Route
        </button>
      </div>

      {/* Body */}
      <section
        ref={formRef}
        className="max-w-6xl mx-auto px-6 mt-10 flex flex-col md:flex-row gap-6 items-stretch"
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
            setLoading={setLoading}
          />
          {routes.length > 0 && <RouteList routes={routes} isDarkMode={isDarkMode} />}
        </div>
          
          {/* Right Column: Map */}
        <div className="w-full md:w-3/5 relative">
          {loading && (
            <div className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <MapSection
            routes={routes}
            isDarkMode={isDarkMode}
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
          />
          </div>
      </section>
    </main>
  );
}

export default TransportPage;
