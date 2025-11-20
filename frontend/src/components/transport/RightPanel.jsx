import location from "../../assets/icons/location.svg";
import map from "../../assets/icons/map.svg";
import cloud from "../../assets/icons/cloud.svg";

function RightPanel({ isDarkMode }) {
  const bgClass = isDarkMode ? "bg-gray-800 text-white" : "bg-blue-50 text-gray-900";

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-1/6 gap-4 px-4">
      {/* Top Section: Alerts */}
      <div className={`rounded-xl p-4 shadow-lg ${bgClass}`}>
        <h3 className="font-semibold mb-2">Transport Alerts</h3>
        <ul className="text-sm space-y-1">
          <li>Tram line 9 delayed by 15 min</li>
          <li>Bus 23 rerouted</li>
          <li>Metro maintenance 22–24 Nov</li>
        </ul>
      </div>

      {/* Middle Section: Icons / Images */}
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <img src={location} alt="Location" className="w-12 h-12" />
        <img src={map} alt="Map" className="w-12 h-12" />
        <img src={cloud} alt="Weather" className="w-12 h-12" />
      </div>

      {/* Bottom Section: Info */}
      <div className={`rounded-xl p-4 shadow-lg mt-auto ${bgClass}`}>
        <h3 className="font-semibold mb-2">Info</h3>
        <p className="text-sm">Remember to bring a valid travel card!</p>
      </div>
    </div>
  );
}

export default RightPanel;
