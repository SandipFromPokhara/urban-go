// src/components/transport/RouteList.jsx

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBus, FaWalking, FaTrain, FaClock, FaSubway, FaRoute } from "react-icons/fa";

function RouteList({ routes, isDarkMode, activeRouteIndex, setActiveRouteIndex }) {
   const [expandedIndex, setExpandedIndex] = useState(null);

   // Create a ref array for each route card
  const cardRefs = useRef([]);

  // Scroll to active card when activeRouteIndex changes
  useEffect(() => {
    if (activeRouteIndex !== null && cardRefs.current[activeRouteIndex]) {
      cardRefs.current[activeRouteIndex].scrollIntoView({
        behavior: "smooth",
        block: "start", // align top of card
      });
      setExpandedIndex(activeRouteIndex); // auto-expand the card
    }
  }, [activeRouteIndex]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
     setActiveRouteIndex(index); // also set as active for map syncing
  };

  if (!routes || routes.length === 0) return null;

  return (
    <div className="space-y-3 overflow-y-auto max-h-[500px] pb-6">
      {routes.map((route, index) => (
        <motion.div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)} // assign ref
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => toggleExpand(index)}
          className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
            isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                       : "bg-gray-50 border-gray-200 hover:bg-blue-50"
                      } ${activeRouteIndex === index ? "border-blue-600 shadow-lg" : ""}`} // highlight active`
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
                {mode === "metro" && <FaSubway />}
                {mode === "tram" && <FaRoute />}
                {mode}
              </div>
            ))}
          </div>

          {/* Step-by-step instructions */}
          {expandedIndex === index && route.steps?.length > 0 && (
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
