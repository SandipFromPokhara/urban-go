// src/components/transport/MapInfoPanel.jsx

import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaExchangeAlt,
  FaLeaf,
} from "react-icons/fa";

function MapInfoPanel({
  isDarkMode,
  routeSummary, // { duration, transfers, modes[], co2 }
}) {
  const [isOpen, setIsOpen] = useState(false);

  const panelClass = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const headerClass = isDarkMode
    ? "bg-blue-800 hover:bg-blue-700"
    : "bg-blue-100 hover:bg-blue-200";

  return (
    <div className={`w-full mt-6 rounded-lg shadow-lg overflow-hidden ${panelClass}`}>

      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-2 font-semibold transition ${headerClass}`}
      >
        <span>Route & Map Info</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className={`p-4 text-sm space-y-4 ${isDarkMode ? "bg-gray-800" : "bg-blue-50"}`}>

          {/* Route Summary */}
          {routeSummary && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{routeSummary.duration} min</span>
              </div>

              <div className="flex items-center gap-2">
                <FaExchangeAlt />
                <span>{routeSummary.transfers} transfers</span>
              </div>

              <div className="flex items-center gap-2">
                <FaLeaf className="text-green-500" />
                <span>{routeSummary.co2} g CO₂</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {routeSummary.modes.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-900"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* How to use map */}
          <div className="pt-4 border-t border-gray-500/20">
            <ul className="list-disc list-inside space-y-1">
              <li>Click stops to see departures</li>
              <li>Select a route to highlight it</li>
              <li>Zoom and pan to explore nearby stops</li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

export default MapInfoPanel;
