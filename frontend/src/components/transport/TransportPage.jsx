// TransportPage.jsx
import { useState, useEffect, useRef } from "react";
import MapSection from "./MapSection";
import HeroSection from "./HeroSection";
import SearchArea from "./SearchArea";
import RouteList from "./Routelist";
import "leaflet/dist/leaflet.css";

function TransportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const formRef = useRef(null);

  // Dark mode based on system preference
  useEffect(() => {
    const darkPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(darkPref);
  }, []);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}>

      {/* Hero Section */}
      <HeroSection />

      {/* Optional top CTA scroll button */}
      <div className="text-center mt-4">
        <button
          onClick={handleScrollToForm}
          className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-md transition-all"
        >
          Plan Your Route
        </button>
      </div>

      {/* Main Body */}
      <section
        ref={formRef}
        className="max-w-6xl mx-auto px-6 mt-10 flex flex-col md:flex-row gap-6 items-stretch"
      >
        {/* Left Column: Search Area */}
        <div className="w-full md:w-2/5 flex flex-col gap-6">
          <SearchArea
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            routes={routes}
            setRoutes={setRoutes}
            isDarkMode={isDarkMode}
          />
          {routes.length > 0 && <RouteList routes={routes} isDarkMode={isDarkMode} />}
        </div>

       {/* Right Column: Map */}
        <div className="w-full md:w-3/5">
          <MapSection
            routes={routes}
            fromPosition={routes[0]?.fromPosition}
            toPosition={routes[0]?.toPosition}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>
    </main>
  );
}

export default TransportPage;
