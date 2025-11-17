import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import LocateButton from "./LocateButton";
import "leaflet/dist/leaflet.css";

function MapSection({ routes }) {
  return (
    <div className="relative w-full h-full min-h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[60.1699, 24.9384]} // Helsinki
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
    </div>
  );
}

export default MapSection;
