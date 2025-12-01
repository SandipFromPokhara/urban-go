import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function MapInfoPanel({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className={`w-full mt-6 rounded-lg shadow-lg overflow-hidden 
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      <button
        onClick={togglePanel}
        className={`w-full flex justify-between items-center px-4 py-2 font-semibold 
          ${isDarkMode ? "bg-blue-800 text-white hover:bg-blue-700" : "bg-blue-100 text-blue-900 hover:bg-blue-200"} 
          transition rounded-t-lg`}
      >
        <span>How to use the map</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className={`p-4 text-sm space-y-2 
          ${isDarkMode ? "bg-gray-800" : "bg-blue-50"} rounded-b-lg`}>
          <ul className="list-disc list-inside space-y-1">
            <li className={isDarkMode ? "text-blue-300" : "text-blue-800"}>Click on markers to view route details.</li>
            <li className={isDarkMode ? "text-green-300" : "text-green-800"}>Select a route from the list to highlight it on the map.</li>
            <li className={isDarkMode ? "text-yellow-300" : "text-yellow-800"}>Use the zoom control to navigate the map.</li>
            <li className={isDarkMode ? "text-purple-300" : "text-purple-800"}>Switch map styles using the control in the top-right corner.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapInfoPanel;
