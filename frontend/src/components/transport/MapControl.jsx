// src/components/transport/MapControl.jsx

import { FaLayerGroup } from "react-icons/fa";

function MapControl({ mapStyle, setMapStyle, isDarkMode }) {
  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() =>
          setMapStyle(mapStyle === "street" ? "satellite" : "street")
        }
        className={`p-2 rounded shadow-md transition-colors duration-200
          ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-blue-600 hover:bg-gray-100"}`}
        title="Toggle map layer"
      >
        <FaLayerGroup size={16} />
      </button>
    </div>
  );
}

export default MapControl;
