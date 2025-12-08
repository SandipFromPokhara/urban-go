// src/components/transport/WeatherCard.jsx

import { weatherIcons } from "../../utils/weatherIcons";
import "../../styles/weatherAnimations.css";

export default function WeatherCard({ weather, isDarkMode }) {
  if (!weather) {
    return <p className="text-sm opacity-70">Weather unavailable</p>;
  };

  const { temp, wind, precipitation, condition } = weather;

  const IconComponent = weatherIcons[condition] || (() => null);

  // Render rain/snow animation if applicable
  const renderPrecipitation = () => {
    if (condition === "rain" || condition === "drizzle") {
      return Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rainDrop"
          style={{ left: `${i * 10}%`, animationDuration: `${0.5 + Math.random()}s` }}
        />
      ));
    }
    if (condition === "snow" || condition === "freezing") {
      return Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="snowFlake"
          style={{ left: `${i * 10}%`, animationDuration: `${1 + Math.random() * 2}s` }}
        />
      ));
    }
    return null;
  };

  return (
    <div className={`relative rounded-xl p-2 shadow-md overflow-hidden ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>
      {/* Weather animation */}
      <div className="absolute inset-0 pointer-events-none">
        {renderPrecipitation()}
      </div>

      <h3 className="font-bold mb-2 text-center underline">Current Weather</h3>
      <div className="flex items-center relative z-10 gap-4">
        <div className="flex items-center justify-center">{IconComponent()}</div>
        <div className="flex flex-col">
          <p className="text-lg font-medium">{temp} °C</p>
          <p className="text-sm opacity-80">Wind: {wind} m/s</p>
          <p className="text-sm opacity-80">Precipitation: {precipitation} mm</p>
        </div>
      </div>
    </div>
  );
}