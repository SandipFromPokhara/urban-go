// src/components/transport/WeatherCard.jsx

import { WiRain, WiStrongWind } from "react-icons/wi";
import { weatherIcons } from "../../utils/weatherIcons";

const getWindDescription = (windKPH) => {
    if (windKPH === null || windKPH === undefined) return "N/A";
    
    // Beaufort Scale approximations (in km/h)
    if (windKPH < 2) return "Calm";
    if (windKPH < 12) return "Light Air"; // 2-11 km/h
    if (windKPH < 20) return "Light Breeze"; // 12-19 km/h
    if (windKPH < 29) return "It's breezy"; // 20-28 km/h
    return "Severe Gale"; // 89+ km/h
};

export default function WeatherCard({ weather, isDarkMode }) {
  if (!weather) return <p className="text-sm opacity-70">Weather unavailable</p>;

  const { temp, wind, precipitation, condition } = weather;
  const IconComponent = weatherIcons[condition] || (() => null);
  const windDescription = getWindDescription(wind);
  // Background gradient by weather type
  const bgGradient = {
    sunny: "bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-200",
    cloudy: "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-300",
    rain: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300",
    snow: "bg-gradient-to-r from-white via-blue-100 to-blue-200",
  }[condition] || (isDarkMode ? "bg-gray-700" : "bg-white");

  return (
    <div
      className={`relative rounded-2xl p-4 shadow-lg overflow-hidden ${bgGradient} ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      } transform transition-transform duration-300 hover:scale-105`}
    >
      <h3 className="text-center font-bold mb-4 text-xl drop-shadow-lg">
        Current Weather
      </h3>

      <div className="flex flex-col items-center relative z-10 gap-3">
        {/* Icon with animated glow */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm shadow-md z-10">
            {IconComponent()}
          </div>
        </div>

        <p className="capitalize">{condition}</p>

        {/* Temperature */}
        <p className="text-3xl font-extrabold drop-shadow-sm">{Math.round(temp)}°C</p>

        {/* Weather details */}
        <div className="flex flex-col items-center text-md opacity-90 space-y-1">
          <p className="flex items-center gap-2">
            <WiStrongWind size={30} /> Wind: {wind ?? "N/A"} km/h
            ({windDescription})
          </p>
          <p className="flex items-center gap-1">
            <WiRain size={25} /> Precipitation: {precipitation ?? 0} mm
          </p>
        </div>
      </div>
    </div>
  );
}
