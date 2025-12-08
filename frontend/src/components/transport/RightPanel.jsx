// src/components/transport/RightPanel.jsx

import { FaLeaf, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";
import WeatherCard from "./WeatherCard";
import { useWeather } from "../../hooks/useWeather";

// Coordinates for Helsinki, Finland
const CAPITAL_REGION_COORDS = { lat: 60.1695, lon: 24.9354 };

function RightPanel({ isDarkMode, co2, ticketInfo, alerts = [] }) {
  const panelClass = isDarkMode
    ? "bg-gray-800 text-white"
    : "bg-blue-50 text-gray-900";

  // Fetch current weather for Helsinki, independent of inputs
  const weather = useWeather(CAPITAL_REGION_COORDS);

  const sectionTitle = "font-bold mb-2 flex items-center gap-2";

  return (
    <aside className="flex flex-col w-full gap-4 overflow-y-auto max-h-screen">

      {/* 🔔 Transport Alerts */}
      <div className={`rounded-xl p-4 shadow-lg ${panelClass}`}>
        <h3 className={sectionTitle}>
          <FaExclamationTriangle size={20} className="text-yellow-500" />
          Transport Alerts
        </h3>

        {alerts.length ? (
          <ul className="text-sm space-y-1">
            {alerts.map((a, i) => (
              <li key={i}>• {a.text}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-80">No major disruptions</p>
        )}
      </div>

      {/* 🌦 Weather */}
      <div className={`rounded-xl shadow-lg ${panelClass}`}>
        {weather ? (
          <WeatherCard weather={weather} isDarkMode={isDarkMode} />
        ) : (
          <p className="text-sm opacity-80">Loading weather...</p>
        )}
      </div>

      {/* 🌱 CO₂ Impact */}
      <div className={`rounded-xl p-4 shadow-lg ${panelClass}`}>
        <h3 className={sectionTitle}>
          <FaLeaf className="text-green-400" />
          Environmental Impact
        </h3>

        {co2 ? (
          <>
            <p className="text-lg font-medium">{co2.grams} g CO₂</p>
            <p className="text-sm opacity-80">
              Avg. per passenger · {co2.mode}
            </p>
          </>
        ) : (
          <p className="text-sm opacity-80">
            Select a route to see CO₂ impact
          </p>
        )}
      </div>

      {/* 🎫 Ticket Info */}
      <div className={`rounded-xl p-4 shadow-lg mt-auto ${panelClass}`}>
        <h3 className={sectionTitle}>
          <FaTicketAlt className="text-purple-400" />
          Ticket
        </h3>

        {ticketInfo ? (
          <>
            <p className="text-lg font-medium">€{ticketInfo.price}</p>
            <p className="text-sm opacity-80">
              Zones {ticketInfo.zones} · {ticketInfo.type}
            </p>
          </>
        ) : (
          <p className="text-sm opacity-80">
            Ticket price will appear here
          </p>
        )}
      </div>

    </aside>
  );
}

export default RightPanel;
