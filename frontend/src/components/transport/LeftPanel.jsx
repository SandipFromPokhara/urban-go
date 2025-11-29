// src/components/transport/LeftPanel.jsx

import bus from "../../assets/icons/bus.svg";
import tram from "../../assets/icons/tram.svg";
import train from "../../assets/icons/train.svg";
import cycle from "../../assets/icons/biking.svg";
import walk from "../../assets/icons/walking.svg";

function LeftPanel({ isDarkMode }) {
  const bgClass = isDarkMode ? "bg-gray-800 text-white" : "bg-blue-50 text-gray-900";

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-1/6 gap-4 px-4">
      {/* Top Section: Text / List */}
      <div className={`rounded-xl p-4 shadow-lg ${bgClass}`}>
        <h3 className="font-semibold mb-2">Popular Routes</h3>
        <ul className="text-sm space-y-1">
          <li>Helsinki Central → Airport</li>
          <li>Kamppi → Pasila</li>
          <li>Helsinki → Espoo</li>
        </ul>
      </div>

      {/* Middle Section: Icons / Images */}
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <img src={walk} alt="Walking" className="w-12 h-12" />
        <img src={tram} alt="Tram" className="w-12 h-12" />
        <img src={cycle} alt="Cycling" className="w-12 h-12" />
        <img src={bus} alt="Bus" className="w-12 h-12" />
        <img src={train} alt="Train" className="w-12 h-12" />
      </div>

      {/* Bottom Section: Tips */}
      <div className={`rounded-xl p-4 shadow-lg mt-auto ${bgClass}`}>
        <h3 className="font-semibold mb-2">Tips</h3>
        <p className="text-sm">Check routes before peak hours to avoid delays.</p>
      </div>
    </div>
  );
}

export default LeftPanel;
