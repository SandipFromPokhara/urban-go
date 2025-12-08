// src/utils/weatherIcons.js

import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiRaindrops, WiThermometerExterior, } from "react-icons/wi";

export const weatherIcons = {
  clear: () => <WiDaySunny size={80} className="text-yellow-400" />,
  cloudy: () => <WiCloudy size={80} className="text-gray-400" />,
  rain: () => <WiRain size={100} className="text-blue-500" />,
  drizzle: () => <WiRaindrops size={100} className="text-blue-300" />,
  snow: () => <WiSnow size={100} className="text-blue-200" />,
  freezing: () => <WiThermometerExterior size={80} className="text-blue-200" />,
};
