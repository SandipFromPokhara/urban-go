// src/components/transport/RightPanel.jsx

import WeatherCard from "./WeatherCard";
import { useWeather } from "../../hooks/useWeather";
import TicketCard from "./TicketCard";

// Coordinates for Helsinki, Finland
const CAPITAL_REGION_COORDS = { lat: 60.1695, lon: 24.9354 };

function RightPanel({ isDarkMode, ticketInfo }) {
  const panelClass = isDarkMode
    ? "bg-gray-800 border text-gray-300"
    : "bg-blue-50";

  // Fetch current weather for Helsinki, independent of inputs
  const weather = useWeather(CAPITAL_REGION_COORDS);

  return (
    <aside className="flex flex-col w-full gap-4 overflow-y-auto max-h-screen sm:px-4">

      {/* 🌦 Weather */}
      <div className={`rounded-xl shadow-lg ${panelClass}`}>
        {weather ? (
          <WeatherCard weather={weather} isDarkMode={isDarkMode} />
        ) : (
          <p className="text-sm opacity-80">Loading weather...</p>
        )}
      </div>

      {/* 🎫 Ticket Info */}
      <TicketCard ticketInfo={ticketInfo} isDarkMode={isDarkMode}/>

    </aside>
  );
}

export default RightPanel;
