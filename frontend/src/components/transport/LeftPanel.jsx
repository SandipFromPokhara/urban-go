import bus from "../../assets/icons/bus.svg";
import tram from "../../assets/icons/tram.svg";
import train from "../../assets/icons/train.svg";
import cycle from "../../assets/icons/biking.svg";
import walk from "../../assets/icons/walking.svg";

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-1/6 gap-4 px-4">
      {/* Top Section: Text / List */}
      <div className={`bg-blue-50 dark:bg-gray-800 rounded-xl p-4 shadow-lg`}>
        <h3 className="font-semibold mb-2">Popular Routes</h3>
        <ul className="text-sm space-y-1">
          <li>Helsinki Central → Airport</li>
          <li>Kamppi → Pasila</li>
          <li>Helsinki → Espoo</li>
        </ul>
      </div>

      {/* Middle Section: Icons / Images */}
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <img src={walk} alt="Train icon" className="w-12 h-12" />
        <img src={tram} alt="Tram icon" className="w-12 h-12" />
        <img src={cycle} alt="Train icon" className="w-12 h-12" />
        <img src={bus} alt="Bus icon" className="w-12 h-12" />
        <img src={train} alt="Train icon" className="w-12 h-12" />
        
      </div>

      {/* Bottom Section: Optional Text */}
      <div className={`bg-blue-50 dark:bg-gray-800 rounded-xl p-4 shadow-lg mt-auto`}>
        <h3 className="font-semibold mb-2">Tips</h3>
        <p className="text-sm">Check routes before peak hours to avoid delays.</p>
      </div>
    </div>
  );
}

export default LeftPanel;
