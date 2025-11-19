import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from "react-leaflet";
import L from "leaflet";
import LocateButton from "./LocateButton";
import MapControl from "./MapControl";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

function MapSection({ routes, isDarkMode, mapStyle, setMapStyle, activeRouteIndex, setActiveRouteIndex }) {
  const mapRef = useRef(null);

  const activeRoutePolyline = activeRouteIndex !== null ? routes[activeRouteIndex]?.polyline || [] : [];

  // Center map on active route
  useEffect(() => {
    if (!mapRef.current || activeRouteIndex === null) return;
    const route = routes[activeRouteIndex];
    if (!route) return;
    mapRef.current.setView(route.position, 14, { animate: true });
  }, [activeRouteIndex, routes]);

  // Fix map resizing when RouteList appears
  useEffect(() => {
    if (!mapRef.current) return;
    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 300);
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

  // Custom icons
  const getTransportIcon = (route) => {
    const icons = {
      metro: "blue",
      tram: "orange",
      bus: "green",
      walk: "yellow",
    };
    const color = icons[route.modes[0]] || "yellow";
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
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
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url={mapStyle === "satellite" ? tiles.satellite : isDarkMode ? tiles.dark : tiles.street}
          attribution={mapStyle === "satellite" ? attribution.satellite : isDarkMode ? attribution.dark : attribution.street}
        />

        <ZoomControl position="bottomright" />

        {routes.map((route, idx) => (
          <Marker
            key={idx}
            position={route.position}
            icon={getTransportIcon(route)}
            eventHandlers={{ click: () => setActiveRouteIndex(idx) }}
          >
            <Popup>{route.name} <br /> {route.info}</Popup>
          </Marker>
        ))}

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
