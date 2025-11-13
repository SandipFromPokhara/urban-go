import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation } from "react-icons/fa";

function SearchArea() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSearch = () => {
    console.log("Searching routes for:", { from, to, date, time });
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
      <div className="flex flex-col gap-3 md-4">
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
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-5 rounded-md mt-2 shadow-md transition-all duration-200"
      >
        <FaSearchLocation />
        Search Routes
      </button>
      </div>
      
      {/* Quick Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between text-sm text-gray-700 mt-4"
      >
        <div className="bg-blue-50 px-3 py-2 rounded-md w-1/3 text-center">
          🌦️ 9°C, Cloudy
        </div>
        <div className="bg-yellow-50 px-3 py-2 rounded-md w-1/3 text-center">
          📏 11 km
        </div>
        <div className="bg-green-50 px-3 py-2 rounded-md w-1/3 text-center">
          🌍 0g CO₂
        </div>
      </motion.div>

      {/* Mock route list */}
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((route) => (
          <div
            key={route}
            className="p-3 bg-gray-50 border rounded-md hover:bg-blue-50 cursor-pointer transition"
          >
            <p className="font-medium text-gray-800">Route Option {route}</p>
            <p className="text-sm text-gray-500">Duration: 35 mins</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchArea;
