// src/components/transport/MapInfoPanel.jsx

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function MapInfoPanel({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className={`w-full rounded-lg shadow-md overflow-hidden ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
      <button
        onClick={togglePanel}
        className={`w-full flex justify-between items-center px-4 py-2 font-semibold ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        } hover:opacity-90 transition`}
      >
        <span>How to use the map</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className="p-4 text-sm space-y-1">
          <ul className="list-disc list-inside">
            <li>Click on markers to view route details.</li>
            <li>Select a route from the list to highlight it on the map.</li>
            <li>Use the zoom control to navigate the map.</li>
            <li>Switch map styles using the control in the top-right corner.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapInfoPanel;
