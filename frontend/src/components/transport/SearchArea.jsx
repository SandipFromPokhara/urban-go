import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";

function SearchArea() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const handleSearch = () => {
    console.log("Searching routes for:", { from, to, date, time });
    setShowInfo(true); // show weather/CO₂/distance info after search
  };

  return (
    <div
      id="search"
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Plan Your Route
      </h2>

      {/* Input fields */}
      <div className="flex flex-col md:gap-4">
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

        {/* Date and Time Inputs horizontally */}
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

        <button
          onClick={handleSearch}
          className="
            flex items-center justify-center gap-2
            bg-gradient-to-r from-blue-500 to-indigo-500
            tracking-widest shadow-xl hover:from-blue-600 hover:to-indigo-600
            transform hover:-translate-y-1
            text-white font-semibold py-2 px-5 rounded-md mt-2
            transition-all duration-200 ease-in-out cursor-pointer"
        >
          <FaSearchLocation />
          Search Routes
        </button>
      </div>

      {/* Animated Quick Info Section */}
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
            <div className="flex flex-col items-center bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <FaCloudSun className="text-2xl text-blue-500 mb-1" />
              <p className="text-sm font-semibold text-gray-800">9°C</p>
              <p className="text-xs text-gray-500">Cloudy</p>
            </div>

            {/* CO2 */}
            <div className="flex flex-col items-center bg-green-50 p-3 rounded-xl shadow-sm border border-green-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <FaLeaf className="text-2xl text-green-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">0g CO₂</p>
              <p className="text-xs text-gray-500">Eco-friendly</p>
            </div>

            {/* Distance */}
            <div className="flex flex-col items-center bg-yellow-50 p-3 rounded-xl shadow-sm border border-yellow-100 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <FaRoute className="text-2xl text-yellow-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">11 km</p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock route list */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 space-y-3"
        >
          {[1, 2, 3].map((route) => (
            <div
              key={route}
              className="p-3 bg-gray-50 border rounded-md hover:bg-blue-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-md"
            >
              <p className="font-medium text-gray-800">Route Option {route}</p>
              <p className="text-sm text-gray-500">Duration: 35 mins</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default SearchArea;
