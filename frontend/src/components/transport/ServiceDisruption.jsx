import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaExclamationTriangle } from "react-icons/fa";

function ServiceDisruption({ isDarkMode, alerts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState({}); // track which alerts are expanded

  const panelClass = isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900";
  const headerClass = isDarkMode
    ? "bg-blue-800 hover:bg-blue-700"
    : "bg-blue-100 hover:bg-blue-200";

  const formatDate = (ts) => ts?.low ? new Date(ts.low * 1000).toLocaleDateString() : "";

  const toggleAlert = (i) => {
    setExpandedAlerts(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className={`w-full mt-6 rounded-lg shadow-lg overflow-hidden ${panelClass}`}>
      {/* Panel Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-2 font-semibold transition ${headerClass} cursor-help`}
      >
        <span className="flex items-center gap-2">
          Transport Disruptions <FaExclamationTriangle size={25} className="inline-block text-yellow-400" />
        </span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className={`p-4 text-sm space-y-3 ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-blue-50 text-gray-900"}`}>
          {alerts.length > 0 ? (
            <ul className="list-none space-y-2">
              {alerts.map((alert, i) => (
                <li
                  key={i}
                  className={`border rounded p-2 cursor-pointer transition ${
                    isDarkMode ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  <div onClick={() => toggleAlert(i)} className="flex justify-between items-center">
                    <p className="font-semibold">{alert.header}</p>
                    {expandedAlerts[i] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  {expandedAlerts[i] && (
                    <div className="mt-1 text-sm space-y-1">
                      <p>{alert.description}</p>
                      {alert.url && (
                        <a
                          href={alert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          More info
                        </a>
                      )}
                      {alert.effectiveStart && alert.effectiveEnd && (
                        <p className="text-xs opacity-70">
                          {formatDate(alert.effectiveStart)} - {formatDate(alert.effectiveEnd)}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="opacity-80">No major disruptions</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ServiceDisruption;
