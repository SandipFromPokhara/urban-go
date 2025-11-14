// SearchArea.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";

function SearchArea({
  from,
  setFrom,
  to,
  setTo,
  date,
  setDate,
  time,
  setTime,
  routes,
  setRoutes,
}) {
  const [showInfo, setShowInfo] = useState(false);

  const handleSearch = () => {
    console.log("Searching routes for:", { from, to, date, time });

    // Example: generate mock routes for demo
    const mockRoutes = [
      {
        name: "Route 1",
        position: [60.1699, 24.9384],
        info: "Duration: 35 min, 0g CO₂",
      },
      {
        name: "Route 2",
        position: [60.1720, 24.9410],
        info: "Duration: 40 min, 0g CO₂",
      },
      {
        name: "Route 3",
        position: [60.1660, 24.9300],
        info: "Duration: 38 min, 0g CO₂",
      },
    ];

    setRoutes(mockRoutes);   // Update map markers
    setShowInfo(true);       // Show weather/CO₂/distance info
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Plan Your Route
      </h2>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Date & Time horizontal */}
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="grow px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-1/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2
                     bg-gradient-to-r from-blue-500 to-indigo-500
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
            <div className="flex flex-col items-center bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <FaCloudSun className="text-2xl text-blue-500 mb-1" />
              <p className="text-sm font-semibold text-gray-800">9°C</p>
              <p className="text-xs text-gray-500">Cloudy</p>
            </div>

            {/* CO2 */}
            <div className="flex flex-col items-center bg-green-50 p-3 rounded-xl shadow-sm border border-green-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <FaLeaf className="text-2xl text-green-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">0g CO₂</p>
              <p className="text-xs text-gray-500">Eco-friendly</p>
            </div>

            {/* Distance */}
            <div className="flex flex-col items-center bg-yellow-50 p-3 rounded-xl shadow-sm border border-yellow-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <FaRoute className="text-2xl text-yellow-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">11 km</p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route List */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 flex-1 overflow-y-auto space-y-3"
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
