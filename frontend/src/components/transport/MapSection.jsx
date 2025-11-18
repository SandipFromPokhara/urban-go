import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import LocateButton from "./LocateButton";
import MapControl from "./MapControl";
import "leaflet/dist/leaflet.css";

function MapSection({ routes, isDarkMode, mapStyle, setMapStyle }) {

  // Tile URLs
  const tiles = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  // Attribution
  const attribution = {
    street: "&copy; OpenStreetMap contributors",
    satellite: "Tiles © Esri — Source: Esri, Maxar, OpenStreetMap contributors",
    dark: "&copy; OpenStreetMap &copy; Carto",
  };

  return (
    <div className={`relative w-full h-[500px] overflow-hidden rounded-lg shadow-xl/30
                  ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >

      <MapContainer
        center={[60.1699, 24.9384]} // Helsinki
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url={mapStyle === "satellite" ? tiles.satellite : isDarkMode ? tiles.dark : tiles.street}
          attribution ={mapStyle === "satellite" ? attribution.satellite : isDarkMode ? attribution.dark : attribution.street}
        />

        <ZoomControl position="bottomright" />

        {routes.map((route, index) => (
          <Marker key={index} position={route.position}>
            <Popup>
              {route.name} <br /> {route.info}
            </Popup>
          </Marker>
        ))}

        <LocateButton />
      </MapContainer>

      <div className="absolute top-4 right-4 z-1000 pointer-events-auto translate-x-5">
        <MapControl mapStyle={mapStyle} setMapStyle={setMapStyle} isDarkMode={isDarkMode} />
      </div>

    </div>
  );
}

export default MapSection;
