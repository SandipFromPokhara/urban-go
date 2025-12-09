// src/components/transport/MapSection.jsx

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from "react-leaflet";
import L from "leaflet";
import LocateButton from "./LocateButton";
import MapControl from "./MapControl";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

function MapSection({ routes = [], isDarkMode, mapStyle, setMapStyle, activeRouteIndex, setActiveRouteIndex }) {
  const mapRef = useRef(null);

  // Filter polyline points to ensure valid lat/lng
  const activeRoutePolyline =
    activeRouteIndex !== null
      ? (routes[activeRouteIndex]?.polyline || []).filter(p => p?.lat !== undefined && p?.lng !== undefined)
      : [];

  // Center map on active route
  useEffect(() => {
    if (!mapRef.current || activeRouteIndex === null) return;
    const route = routes[activeRouteIndex];
    if (!route?.position?.lat || !route?.position?.lng) return;
    mapRef.current.setView(route.position, 14, { animate: true });
  }, [activeRouteIndex, routes]);

  // Fix map resizing when RouteList appears
  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => mapRef.current.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [routes]);

  // Tile URLs
  const tiles = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  const attribution = {
    street: "&copy; OpenStreetMap contributors",
    satellite: "Tiles © Esri — Source: Esri, Maxar, OpenStreetMap contributors",
    dark: "&copy; OpenStreetMap &copy; Carto",
  };

  // Normalize transport modes
  const normalizeMode = mode => {
    if (!mode) return "walk";
    const m = mode.toLowerCase();
    switch (m) {
      case "subway": return "metro";
      case "rail": return "train";
      case "ferry":
      case "boat": return "boat";
      case "tram": return "tram";
      case "bus": return "bus";
      case "walk":
      default: return "walk";
    }
  };

  // Marker icons
  const getTransportIcon = route => {
    const icons = {
      metro: "orange",
      tram: "green",
      bus: "blue",
      walk: "yellow",
      train: "purple",
      boat: "teal",
    };
    const mode = normalizeMode(route.modes?.[0]?.m);
    const color = icons[mode] || "yellow";
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  // Emoji for steps
  const modeEmoji = {
    walk: "🚶",
    tram: "🚊",
    bus: "🚌",
    metro: "🚇",
    train: "🚆",
    boat: "⛴️",
  };

  return (
    <div className={`relative w-full flex-1 h-full overflow-hidden rounded-lg shadow-xl/30 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <MapContainer
        ref={mapRef}
        center={[60.1699, 24.9384]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
        whenCreated={mapInstance => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url={mapStyle === "satellite" ? tiles.satellite : isDarkMode ? tiles.dark : tiles.street}
          attribution={mapStyle === "satellite" ? attribution.satellite : isDarkMode ? attribution.dark : attribution.street}
        />

        <ZoomControl position="bottomright" />

        {routes.map((route, idx) =>
          route?.position?.lat && route?.position?.lng ? (
            <Marker
              key={idx}
              position={route.position}
              icon={getTransportIcon(route)}
              eventHandlers={{ click: () => setActiveRouteIndex(idx) }}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-lg">
                    {route.origin || "Origin"} → {route.destination || "Destination"}
                  </strong>
                  <div className="mt-1 mb-2">
                    <span className="font-medium">Duration:</span> {route.duration ?? "N/A"} min
                  </div>

                  {route.steps?.length > 0 ? (
                    <ol className="list-decimal ml-4 space-y-1">
                      {route.steps.map((step, i) => {
                        const mode = normalizeMode(step.mode);
                        return (
                          <li key={i} className="flex items-start gap-1">
                            <span className="w-5">{modeEmoji[mode] || "🚶"}</span>
                            <span>
                              <strong>{mode.toUpperCase()}</strong> from{" "}
                              {step.from_name || step.from || "Unknown"} to{" "}
                              {step.to_name || step.to || "Unknown"} ({step.distance ?? 0} km)
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <div>No steps available</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        )}

        {activeRoutePolyline.length > 0 && (
          <Polyline positions={activeRoutePolyline} color="#007bff" weight={5} />
        )}

        <LocateButton />
      </MapContainer>

      <div className="absolute top-4 right-4 z-50 pointer-events-auto translate-x-5">
        <MapControl mapStyle={mapStyle} setMapStyle={setMapStyle} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default MapSection;
