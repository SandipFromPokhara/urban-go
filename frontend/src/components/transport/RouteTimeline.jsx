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
  const [showStops, setShowStops] = useState({});
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

  const toggleStops = (routeIdx, stepIdx) => {
    setShowStops((prev) => ({
      ...prev,
      [`${routeIdx}-${stepIdx}`]: !prev[`${routeIdx}-${stepIdx}`],
    }));
  };

  if (!routes || routes.length === 0) return null;

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const normalizeMode = (mode) => {
    if (!mode) return "walk";
    const m = mode.toLowerCase();
    switch (m) {
      case "subway": return "metro";
      case "rail": return "train";
      case "ferry":
      case "boat": return "ferry";
      case "tram": return "tram";
      case "bus": return "bus";
      case "walk":
      default: return "walk";
    }
  };

  const modeIcon = (mode) => {
    switch (mode) {
      case "walk": return <FaWalking className="text-yellow-600" />;
      case "metro": return <FaSubway className="text-orange-600" />;
      case "train": return <FaTrain className="text-purple-600" />;
      case "bus": return <FaBus className="text-blue-600" />;
      case "ferry": return <FaShip className="text-teal-600" />;
      case "tram": return <FaTram className="text-green-600" />;
      default: return "•";
    }
  };

  const modeColor = (mode) => {
    switch (mode) {
      case "walk": return "bg-yellow-200";
      case "metro": return "bg-orange-200";
      case "train": return "bg-purple-200";
      case "bus": return "bg-blue-200";
      case "ferry": return "bg-teal-200";
      case "tram": return "bg-green-200";
      default: return "bg-gray-200";
    }
  };

  const computeTicket = (route) => {
    const zonesUsed = new Set();
    route.steps.forEach((s) => {
      if (s.zones?.from) zonesUsed.add(s.zones.from);
      if (s.zones?.to) zonesUsed.add(s.zones.to);
    });
    const allZones = ["A", "B", "C", "D"];
    const used = allZones.filter(z => zonesUsed.has(z));
    return used.join("") || "Unknown";
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pb-6">
      {routes.map((route, idx) => {
        const totalWalking = route.steps
          .filter((s) => s.mode === "walk")
          .reduce((sum, s) => sum + s.duration, 0);

        const totalStops = route.steps.reduce(
          (sum, s) => sum + (s.intermediateStops?.length || 0),
          0
        );

        const ticket = computeTicket(route);

        return (
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
            {/* Top Row */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-lg">
                <FaClock className="text-gray-400" /> {route.duration || "Unknown"} min
              </div>
              <span className="text-sm text-gray-400">
                {cap(fromInput) || route.origin} → {cap(toInput) || route.destination}
              </span>
            </div>

            {/* Horizontal Timeline */}
            <div className="flex items-center gap-2 overflow-visible justify-start pl-23 mb-2 relative">
              {route.steps?.map((step, i) => {
                const mode = normalizeMode(step.mode);
                const label = cap(mode) + (step.routeShortName ? ` ${step.routeShortName}` : "");

                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, y: -4 }}
                    className="relative flex flex-col items-center group px-3 py-2"
                  >
                    {/* Icon */}
                    <div className={`w-6 h-6 flex items-center justify-center text-white rounded-full ${modeColor(mode)} shadow-md z-10`}>
                      {modeIcon(mode)}
                    </div>

                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none z-0"
                      initial={{ scale: 1, opacity: 0 }}
                      whileHover={{
                        scale: 1.6,
                        opacity: 0.3,
                        transition: { duration: 0.6, repeat: Infinity, repeatType: "loop" }
                      }}
                    >
                      <div className={`w-full h-full rounded-full border-2 border-blue-400`} />
                    </motion.div>

                    {/* Tooltip */}
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2
                                    text-xs font-semibold px-2 py-1 rounded whitespace-nowrap
                                    opacity-0 group-hover:opacity-100 transition-all z-50
                                    ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                      {label}
                      {/* small arrow below tooltip */}
                      <div className={`absolute left-1/2 -bottom-1 w-2 h-2 bg-current transform -translate-x-1/2 rotate-45`} />
                    </div>

                    {/* Connector */}
                    {i < route.steps.length - 1 && <div className="w-6 h-1 bg-gray-300 mt-1 z-10" />}
                  </motion.div>
                );
              })}
            </div>

            {/* Step Details */}
            {expandedIndex === idx && route.steps?.length > 0 && (
              <div className="flex flex-col gap-2 mt-2 relative pl-2">
                <div className="text-xs text-gray-500 mb-1 ml-6">
                  Total walking: {totalWalking} min • Total stops: {totalStops} • Ticket: {ticket}
                </div>

                {route.steps.map((step, i) => {
                  const mode = normalizeMode(step.mode);
                  const stopKey = `${idx}-${i}`;
                  const stops = step.intermediateStops || [];

                  return (
                    <div key={i} className="flex flex-col relative">
                      {/* Dot + Connector */}
                      <div className="absolute left-0 flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full ${modeColor(mode)} border-2 border-white z-10`} />
                        {i < route.steps.length - 1 && <div className="w-px flex-1 bg-gray-300 mt-0.5" />}
                      </div>

                      {/* Step Info + Show/Hide */}
                      <div className="flex items-center justify-between w-full ml-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 font-semibold text-sm">
                            {modeIcon(mode)}
                            {cap(mode)} {step.routeShortName && step.routeShortName} ({step.duration} mins)
                          </div>

                          <div className="text-xs text-gray-400">
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
                            <div className="text-xs text-gray-500">
                              {cap(mode)} full route info: {step.routeLongName}
                            </div>
                          )}
                        </div>

                        {stops.length >= 1 && (
                          <button
                            className="text-blue-500 text-xs underline hover:text-blue-700 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStops(idx, i);
                            }}
                          >
                            {showStops[stopKey] ? "Hide stops ↑" : "Show stops ↓"}
                          </button>
                        )}
                      </div>

                      {showStops[stopKey] && (
                        <div className="ml-6 mt-1 text-xs text-gray-700 flex flex-wrap gap-2">
                          {stops.map((s, j) => (
                            <div key={j} className="flex gap-1 items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              <span>{s.name}</span>
                              {s.platform && <span className="text-gray-500">({s.platform})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
