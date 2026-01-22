// src/components/transport/MapSection.jsx
import { MapContainer, TileLayer, ZoomControl, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import LocateButton from "./LocateButton";
import MapControl from "./MapControl";
import "leaflet/dist/leaflet.css";


// --- Marker Icons (GitHub Leaflet markers)
const originIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultCenter = [60.1699, 24.9384]; // Helsinki

function MapSection({
  routes = [],
  isDarkMode,
  mapStyle,
  setMapStyle,
  activeRouteIndex,
}) {
  const mapRef = useRef(null);

  const activeRoute =
  routes.length > 0
    ? routes[activeRouteIndex ?? 0]
    : null;

  // --- Polyline
  const polyline =
    activeRoute?.polyline?.filter(
      (p) => p?.lat !== undefined && p?.lng !== undefined
    ) || [];

  // --- Origin & destination from steps
  const origin =
    polyline.length > 0
      ? {
          lat: polyline[0].lat,
          lng: polyline[0].lng,
        }
      : null;

  const destination =
    polyline.length > 0
      ? {
          lat: polyline[polyline.length - 1].lat,
          lng: polyline[polyline.length - 1].lng,
        }
      : null;

  // --- Fit bounds to route
  useEffect(() => {
    if (!mapRef.current || !activeRoute) return;

    if (polyline.length > 1) {
      const bounds = L.latLngBounds(polyline.map(p => [p.lat, p.lng]));
      mapRef.current.fitBounds(bounds, { padding: [60, 60], animate: true });
    } else if (polyline.length === 1) {
      mapRef.current.setView([polyline[0].lat, polyline[0].lng], 14, { animate: true });
    }
  }, [activeRouteIndex, polyline, activeRoute]);

  // --- Tile providers
  const tiles = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark:
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  const attribution = {
    street: "&copy; OpenStreetMap contributors",
    satellite:
      "Tiles © Esri — Source: Esri, Maxar, OpenStreetMap contributors",
    dark: "&copy; OpenStreetMap &copy; Carto",
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl/30">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url={
            mapStyle === "satellite"
              ? tiles.satellite
              : isDarkMode
              ? tiles.dark
              : tiles.street
          }
          attribution={
            mapStyle === "satellite"
              ? attribution.satellite
              : isDarkMode
              ? attribution.dark
              : attribution.street
          }
        />

        <ZoomControl position="bottomright" />

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
            <Popup>
              <strong>Origin</strong>
              <br />
              {origin.name || "Start location"}
            </Popup>
          </Marker>
        )}

        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          >
            <Popup>
              <strong>Destination</strong>
              <br />
              {destination.name || "End location"}
            </Popup>
          </Marker>
        )}

        {polyline.length > 0 && (
          <Polyline positions={polyline} color="#007bff" weight={5} />
        )}

        <LocateButton />
      </MapContainer>

      <div className="absolute top-4 right-4 z-1000">
        <MapControl
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default MapSection;
