// SearchArea.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";

function SearchArea({
  from, setFrom, to, setTo,
  date, setDate, time, setTime,
  routes, setRoutes, isDarkMode,
  formInputRef, setLoading
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState("");

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
      // Mock routes for demo
      const mockRoutes = [
        { name: "Route 1", duration: 35, co2: 0, modes: ["bus", "metro"], info: "🚶 5 min, 🚌 510, 🚇 M1", position: [60.1699, 24.9384] },
        { name: "Route 2", duration: 40, co2: 0, modes: ["walk", "tram"], info: "🚶 7 min, 🚋 6", position: [60.1921, 24.9458] },
        { name: "Route 3", duration: 40, co2: 0, modes: ["bus", "walk"], info: "🚶 10 min, 🚋 41", position: [60.1746, 24.9678] }
      ];
      setRoutes(mockRoutes);    // Update map markers
      setShowInfo(true);        // Show weather/CO₂/distance info
      setLoading(false);
    }, 800); // simulate network
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg/30  flex flex-col gap-5
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}>

      <h2 className="text-2xl font-bold mb-2">Plan Your Route</h2>

      {error && (<p className="text-red-500 text-sm">{error}</p>)}

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <input
          ref={formInputRef}
          type="text"
          placeholder="Enter origin"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2
            ${isDarkMode? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-400 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2
            ${isDarkMode? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-400 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          }`}
        />

        {/* Date & Time horizontal */}
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2
              ${isDarkMode? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white"
                          : "bg-gray-50 border-gray-300 focus:ring-blue-500 text-gray-900"
          }`}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white"
              : "bg-gray-50 border-gray-300 focus:ring-blue-500 text-gray-900"
          }`}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2
                     bg-linear-to-r from-blue-500 to-indigo-500
                     hover:from-blue-600 hover:to-indigo-600
                     transform hover:-translate-y-1
                     text-white font-semibold py-2 px-5 rounded-md mt-2
                     transition-all duration-200 ease-in-out cursor-pointer"
        >
          <FaSearchLocation /> Search Routes
        </button>
      </div>

      {/* Animated Quick Info */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-3 mt-4"
          >
            {/* Weather */}
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
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 flex-1 overflow-y-auto space-y-3 max-h-64 pt-1"
        >
          {routes.map((route, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 border rounded-md hover:bg-blue-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-md"
            >
              <p className="font-medium text-gray-800">{route.name}</p>
              <p className="text-sm text-gray-500">{route.info}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default SearchArea;
