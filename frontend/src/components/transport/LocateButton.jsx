// src/components/transport/LocateButton.jsx

import { useMap } from "react-leaflet";
import L from "leaflet";
import { FaLocationArrow } from "react-icons/fa";

function LocateButton() {
  const map = useMap();

  // Custom blue user marker
  const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 14);

          L.marker([latitude, longitude], { icon: userIcon }) // ✅ use custom icon
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
    <div className="absolute bottom-30 right-3 z-1000">
      <button
        onClick={handleLocate}
        className="bg-white hover:bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-sm shadow-lg transition-all duration-200"
        title="Locate Me"
      >
        <FaLocationArrow className="text-sm" />
      </button>
    </div>
  );
}

export default LocateButton;
