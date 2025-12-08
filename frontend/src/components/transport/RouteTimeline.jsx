// src/components/transport/RouteTimeline.jsx

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBus, FaWalking, FaTrain, FaTram, FaSubway, FaShip, FaClock } from "react-icons/fa";

export default function RouteTimeline({ routes, isDarkMode, activeRouteIndex, setActiveRouteIndex, fromInput, toInput }) {
  const [expandedIndex, setExpandedIndex] = useState(activeRouteIndex);
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
    setShowStops((prev) => ({ ...prev, [`${routeIdx}-${stepIdx}`]: !prev[`${routeIdx}-${stepIdx}`] }));
  };

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const normalizeMode = (mode) => {
    if (!mode) return "walk";
    switch (mode.toLowerCase()) {
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
      s.zones.forEach((z) => z && zonesUsed.add(z));
    });

    const order = ["A", "B", "C", "D"];
    const used = order.filter(z => zonesUsed.has(z));

    if (!used.length) return "Unknown";

    // **Auto-expand gaps to include all zones between first and last**
    const first = order.indexOf(used[0]);
    const last = order.indexOf(used[used.length - 1]);
    return order.slice(first, last + 1).join("");
  };

  const ticketInfo = (ticket) => {
    if (ticket === "Unknown") return null;
    const zoneCount = ticket.length;
    switch (zoneCount) {
      case 1:
      case 2: return { label: ticket, group: "2-zone ticket" };
      case 3: return { label: ticket, group: "3-zone ticket" };
      case 4: return { label: ticket, group: "4-zone ticket" };
      default: return null;
    }
  };

  const getRouteStats = (route) => {
    const walking = route.steps.filter((s) => s.mode === "walk").reduce((sum, s) => sum + s.duration, 0);
    return { walking, duration: route.duration ?? Infinity };
  };

  const routeStats = routes.map(getRouteStats);
  const fastestRouteIdx = routeStats.reduce((best, cur, i) => cur.duration < routeStats[best].duration ? i : best, 0);
  const leastWalkingRouteIdx = routeStats.reduce((best, cur, i) => cur.walking < routeStats[best].walking ? i : best, 0);

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pb-6 relative">
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-2">
          {routes.map((_, i) => (
            <button
              key={i}
              onClick={() => toggleExpand(i)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${i === activeRouteIndex ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {routes.map((route, idx) => {
        const isActive = idx === activeRouteIndex;
        const totalWalking = route.steps.filter((s) => s.mode === "walk").reduce((sum, s) => sum + s.duration, 0);
        const ticketMeta = ticketInfo(computeTicket(route));

        return (
          <motion.div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`p-4 rounded-xl transition-shadow border ${isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-white border-gray-200 hover:shadow-lg"} ${isActive ? "border-blue-500 shadow-lg" : ""}`}
          >
            {/* Top Row */}
            <div className="flex flex-col mb-2 cursor-pointer" onClick={() => toggleExpand(idx)}>
              {/* First row: Route + badges + duration */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <span>Route {idx + 1}</span>
                  {idx === fastestRouteIdx && (<span className="ml-4 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold">Fastest</span>)}
                  {idx === leastWalkingRouteIdx && (<span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold">Least walking</span>)}
                  </div>
                    <div className="flex items-center justify-items-end gap-2 font-bold text-lg">
                      <FaClock className="text-gray-800" /> {route.duration || "Unknown"} mins
                    </div>
                  </div>

                  {/* Second row: From → To */}
                  <div className="text-xs text-gray-800 mt-1">
                    {cap(fromInput) || route.origin} → {cap(toInput) || route.destination}
                  </div>
                </div>

            {/* Horizontal Timeline */}
            <div className="flex items-center gap-2 overflow-visible justify-start pl-24 mb-2 relative">
              {route.steps.map((step, i) => {
                const mode = normalizeMode(step.mode);
                const label = cap(mode) + (step.routeShortName ? ` ${step.routeShortName}` : "");
                return (
                  <motion.div key={i} whileHover={{ scale: 1.2, y: -4 }} className="relative flex flex-col items-center group px-3 py-2">
                    <div className={`w-6 h-6 flex items-center justify-center text-white rounded-full ${modeColor(mode)} shadow-md z-10`}>{modeIcon(mode)}</div>
                    <motion.div className="absolute inset-0 rounded-full pointer-events-none z-0" initial={{ scale: 1, opacity: 0 }} whileHover={{ scale: 1.6, opacity: 0.3, transition: { duration: 0.6, repeat: Infinity, repeatType: "loop" } }}>
                      <div className="w-full h-full rounded-full border-2 border-blue-400" />
                    </motion.div>
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all z-50 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
                      {label}
                      <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-current transform -translate-x-1/2 rotate-45" />
                    </div>
                    {i < route.steps.length - 1 && <div className="w-6 h-1 bg-gray-300 mt-1 z-10" />}
                  </motion.div>
                );
              })}
            </div>

            {/* Step Details */}
            {expandedIndex === idx && route.steps.length > 0 && (
              <div className="flex flex-col gap-4 mt-2 relative pl-2">
                <div className="text-xs text-gray-500 mb-1 ml-6">
                  Total walking: {totalWalking} mins. Required ticket:{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{ticketMeta?.label}</span>
                  {ticketMeta && <span className="ml-1 text-gray-400">({ticketMeta.group})</span>}
                </div>

                {route.steps.map((step, i) => {
                  const mode = normalizeMode(step.mode);
                  const stopKey = `${idx}-${i}`;
                  const stops = step.intermediateStops || [];

                  return (
                    <div key={i} className="flex flex-col gap-3 relative">
                      <div className="absolute left-0 flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full ${modeColor(mode)} border-2 border-white z-10`} />
                        {i < route.steps.length - 1 && <div className="w-px flex-1 bg-gray-300 mt-0.5" />}
                      </div>

                      <div className="flex items-center justify-between w-full ml-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 font-semibold text-base">
                            {modeIcon(mode)} {cap(mode)} {step.routeShortName && step.routeShortName} ({step.duration} mins)
                          </div>
                          <div className="text-sm text-black">
                            {step.from_name} → {step.to_name} ({step.distance} km)
                            <br />
                            {step.startTime && step.endTime && (
                              <span>{new Date(step.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} → {new Date(step.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            )}
                          </div>
                          {step.routeLongName && <div className="text-xs text-gray-500">{cap(mode)} full route info: {step.routeLongName}</div>}
                        </div>

                        {stops.length >= 1 && (
                          <button className="text-blue-500 text-xs underline hover:text-blue-700 mr-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleStops(idx, i); }}>
                            {showStops[stopKey] ? "Hide stops ↑" : "Show stops ↓"}
                          </button>
                        )}
                      </div>

                      {showStops[stopKey] && (
                        <div className="ml-6 mt-1 text-xs text-black flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          {stops.map((s, j) => (
                            <div key={j} className="flex flex-col bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded items-start">
                              <span className="font-semibold ">{s.name}</span>
                              {s.platform && <span className="text-gray-500">Platform {s.platform}</span>}
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
