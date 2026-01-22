import { useState, useEffect } from "react";

export const useWeather = (selectedCoords) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // if coords are not set, do nothing
    if (!selectedCoords) {
      setWeather(null); // optional: reset weather
      return;
    }

    const fetchWeather = async () => {
      try {
        const { lat, lon } = selectedCoords;
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch failed", err);
        setWeather(null);
      }
    };

    fetchWeather();
  }, [selectedCoords]); // fixed dependency array length

  return weather;
};
