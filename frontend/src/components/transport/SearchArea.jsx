// SearchArea.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";
import FloatingInput from "./ui/FloatingInput";
import SwapButton from "./ui/SwapButton";
import RouteList from "./RouteList"; // ✅ Correct import

function SearchArea({
  from, setFrom, to, setTo,
  date, setDate, time, setTime,
  routes, setRoutes, isDarkMode,
  formInputRef, loading, setLoading,
  activeRouteIndex, setActiveRouteIndex,
  swapLocations, fillCurrentLocation
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState("");

  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white placeholder-gray-400"
    : "bg-gray-50 border-gray-400 focus:ring-blue-500 text-gray-900 placeholder-gray-500";

  const handleSearch = () => {
    if (!from || !to) {
      setError("Please enter both origin and destination");
      return;
    }

    setError("");
    setLoading(true);
    setShowInfo(false);

    // Mock routes for demo
    setTimeout(() => {
      const mockRoutes = [
        { name: "Route 1", duration: 35, co2: 0, modes: ["bus", "metro"], info: "🚶 5 min, 🚌 510, 🚇 M1", steps: ["Walk 5 min to bus stop", "Take bus 510", "Transfer to metro M1"], position: [60.1699, 24.9384] },
        { name: "Route 2", duration: 40, co2: 0, modes: ["walk", "tram"], info: "🚶 7 min, 🚋 6", steps: ["Walk 7 min", "Take tram 6"], position: [60.1921, 24.9458] },
        { name: "Route 3", duration: 40, co2: 0, modes: ["bus", "walk"], info: "🚶 10 min, 🚋 41", steps: ["Walk 10 min", "Take bus 41"], position: [60.1746, 24.9678] }
      ];
      setRoutes(mockRoutes);
      setShowInfo(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg/30 flex flex-col gap-5 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <FloatingInput
          ref={formInputRef}
          type="text"
          icon="start"
          placeholder="Enter origin"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          onUseLocation={fillCurrentLocation}
          className={inputClass}
        />

        {/* Swap button */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            className="cursor-pointer"
            onClick={swapLocations}
          >
            <SwapButton />
          </motion.div>
        </div>

        <FloatingInput
          type="text"
          icon="end"
          placeholder="Enter destination"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={inputClass}
        />

        {/* Date & Time */}
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${inputClass}`}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${inputClass}`}
          />
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-md font-semibold
              transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-1
              ${loading ? 'bg-blue-700 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'}
              text-white`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            <>
              <FaSearchLocation />
              Search Routes
            </>
          )}
        </button>
      </div>

      {/* Quick Info */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-3 mt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-100">
              <FaCloudSun className="text-2xl text-blue-500 mb-1" />
              <p className="text-sm font-semibold text-gray-800">9°C</p>
              <p className="text-xs text-gray-500">Cloudy</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center bg-green-50 p-3 rounded-xl shadow-sm border border-green-100">
              <FaLeaf className="text-2xl text-green-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">0g CO₂</p>
              <p className="text-xs text-gray-500">Eco-friendly</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center bg-yellow-50 p-3 rounded-xl shadow-sm border border-yellow-100">
              <FaRoute className="text-2xl text-yellow-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">11 km</p>
              <p className="text-xs text-gray-500">Distance</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route List */}
      {showInfo && routes.length > 0 && (
        <RouteList
          routes={routes}
          isDarkMode={isDarkMode}
          activeRouteIndex={activeRouteIndex}
          setActiveRouteIndex={setActiveRouteIndex}
        />
      )}
    </div>
  );
}

export default SearchArea;
