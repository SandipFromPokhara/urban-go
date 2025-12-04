// src/components/transport/RouteTimeline.jsx

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBus, FaWalking, FaTrain, FaTram, FaSubway, FaShip, FaClock } from "react-icons/fa";

export default function RouteTimeline({
  routes,
  isDarkMode,
  activeRouteIndex,
  setActiveRouteIndex,
  fromInput,
  toInput
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (activeRouteIndex !== null && cardRefs.current[activeRouteIndex]) {
      cardRefs.current[activeRouteIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      setExpandedIndex(activeRouteIndex);
    }
  }, [activeRouteIndex]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setActiveRouteIndex(index);
  };

  if (!routes || routes.length === 0) return null;

  const normalizeMode = (mode) => {
    if (!mode) return "walk";
    const m = mode.toLowerCase();
    switch (m) {
      case "subway":
        return "metro";
      case "rail":
        return "train";
      case "ferry":
      case "boat":
        return "ferry";
      case "tram":
        return "tram";
      case "bus":
        return "bus";
      case "walk":
      default:
        return "walk";
    }
  };

  const modeIcon = (mode) => {
    switch (mode) {
      case "walk":
        return <FaWalking className="text-yellow-600" />;
      case "metro":
        return <FaSubway className="text-orange-600" />;
      case "train":
        return <FaTrain className="text-purple-600" />;
      case "bus":
        return <FaBus className="text-blue-600" />;
      case "ferry":
        return <FaShip className="text-teal-600" />;
      case "tram":
        return <FaTram className="text-green-600" />;
      default:
        return "•";
    }
  };

  const modeColor = (mode) => {
    switch (mode) {
      case "walk":
        return "bg-yellow-200";
      case "metro":
        return "bg-orange-200";
      case "train":
        return "bg-purple-200";
      case "bus":
        return "bg-blue-200";
      case "ferry":
        return "bg-teal-200";
      case "tram":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pb-6">
      {routes.map((route, idx) => (
        <motion.div
          key={idx}
          ref={(el) => (cardRefs.current[idx] = el)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => toggleExpand(idx)}
          className={`p-4 rounded-xl cursor-pointer transition-shadow border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-white border-gray-200 hover:shadow-lg"
          } ${activeRouteIndex === idx ? "border-blue-500 shadow-lg" : ""}`}
        >
          {/* Top Row: Duration + Start/End */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 font-bold text-lg">
              <FaClock className="text-gray-400" /> {route.duration} min
            </div>
            <span className="text-sm text-gray-400">
              {fromInput || route.origin} → {toInput || route.destination}
            </span>
          </div>

          {/* Horizontal Mode Timeline */}
          <div className="flex items-center gap-2 overflow-x-auto mb-2">
            {route.steps?.map((step, i) => {
              const mode = normalizeMode(step.mode);
              return (
                <div key={i} className="relative group flex flex-col items-center gap-1 overflow-visible">
                  {/* Mode Icon */}
                  <div className={`w-6 h-6 flex items-center justify-center text-white rounded-full ${modeColor(mode)}`}>
                    {modeIcon(mode)}
                  </div>

                  {/* Hover Badge for Route Number */}
                  {step.routeShortName && (
                    <span className="absolute -top-6 text-xs font-semibold bg-gray-200 text-gray-700 px-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {step.routeShortName}
                    </span>
                  )}

                  {/* Connector */}
                  {i < route.steps.length - 1 && <div className="w-6 h-1 bg-gray-300" />}
                </div>
              );
            })}
          </div>

          {/* Step Timeline */}
          {expandedIndex === idx && route.steps?.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 relative pl-2">
              {route.steps.map((step, i) => {
                const mode = normalizeMode(step.mode);
                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    {/* Dot + Connector */}
                    <div className="absolute left-0 flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${modeColor(mode)} border-2 border-white z-10`} />
                      {i < route.steps.length - 1 && <div className="w-px flex-1 bg-gray-300 mt-0.5" />}
                    </div>

                    {/* Step Info */}
                    <div className="pl-2">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        {modeIcon(mode)}
                        {mode.toUpperCase()} {step.routeShortName && ` ${step.routeShortName}`} ({step.duration} mins)
                      </div>

                      <div className="text-xs text-gray-400 ml-6">
                        {step.from_name} → {step.to_name} ({step.distance} km)
                        <br />
                        {step.startTime && step.endTime && (
                          <span>
                            {new Date(step.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} →{" "}
                            {new Date(step.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>

                      {step.routeLongName && (
                        <div className="text-xs text-gray-500 ml-6">
                          Route-info: {step.routeLongName}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
