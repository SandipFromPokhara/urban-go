import { useState } from "react";
import { motion } from "framer-motion";
import { FaBus, FaWalking, FaTrain, FaClock } from "react-icons/fa";

function RouteList({ routes, isDarkMode }) {
   const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!routes || routes.length === 0) return null;

  return (
    <div className="space-y-3">
      {routes.map((route, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => toggleExpand(index)}
          className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
            isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-gray-50 border-gray-200 hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">{route.name}</p>
            <div className="flex items-center gap-2 text-gray-500">
              <FaClock />
              <span>{route.duration} mins</span>
            </div>
          </div>

            {/* Transport Modes */}
          <div className="flex gap-2 mt-2 text-sm">
            {route.modes.map((mode, i) => (
              <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
                }`}
                >
                {mode === "bus" && <FaBus />}
                {mode === "walk" && <FaWalking />}
                {mode === "train" && <FaTrain />}
                {mode}
              </div>
            ))}
          </div>

          {/* Step-by-step instructions */}
          {expandedIndex === index && (
            <div className="mt-2 text-sm text-gray-400">
              {route.steps.map((step, i) => (
                <p key={i}>• {step}</p>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default RouteList;
