// LocateButton.jsx
import { useMap } from "react-leaflet";
import L from "leaflet";
import { FaLocationArrow } from "react-icons/fa";

function LocateButton() {
  const map = useMap();

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 14);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("📍 You are here!")
            .openPopup();
        },
        () => alert("Unable to retrieve your location.")
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  return (
    <div className="absolute bottom-[27%] right-3 z-1000 flex flex-col items-center space-y-2">
      <button
        onClick={handleLocate}
        className="bg-white hover:bg-blue-100 text-blue-600 p-2 rounded-full shadow-md transition-all duration-200"
        title="Locate Me"
      >
        <FaLocationArrow className="text-lg" />
      </button>
    </div>
  );
}

export default LocateButton;
