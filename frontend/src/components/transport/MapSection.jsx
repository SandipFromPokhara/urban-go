import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from "react-leaflet";
import L from "leaflet";
import LocateButton from "./LocateButton";
import MapControl from "./MapControl";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";

function MapSection({ routes, isDarkMode, mapStyle, setMapStyle, activeRouteIndex, setActiveRouteIndex }) {
  const mapRef = useRef(null);

  // Calculate the active polyline from the props (Derived State)
  const activeRoutePolyline = activeRouteIndex !== null
    ? routes[activeRouteIndex]?.polyline || []
    : [];

  // Center map on active route
  useEffect(() => {
    if (!mapRef.current) return;
    if (activeRouteIndex === null) return;

    const map = mapRef.current;
    const route = routes[activeRouteIndex];
    if (!route) return;

    map.setView(route.position, 14, { animate: true });
  }, [activeRouteIndex, routes]);

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

  // HSL-style custom icons
  const metroIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const tramIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const busIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const walkIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const getTransportIcon = (route) => {
    if (route.modes.includes("metro")) return metroIcon;
    if (route.modes.includes("tram")) return tramIcon;
    if (route.modes.includes("bus")) return busIcon;
    return walkIcon;
  };

  return (
    <div className={`relative w-full h-[500px] overflow-hidden rounded-lg shadow-xl/30
                    ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
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

        {routes.map((route, index) => (
          <Marker
            key={index}
            position={route.position}
            icon={getTransportIcon(route)}
            eventHandlers={{
              click: () => {
                setActiveRouteIndex(index);
              },
            }}
          >
            <Popup>
              {route.name} <br /> {route.info}
            </Popup>
          </Marker>
        ))}

        {activeRoutePolyline.length > 0 
        && (<Polyline positions={activeRoutePolyline}
        color="#007bff" // Added color for visibility
          weight={5}
          />
          )}

        <LocateButton />
      </MapContainer>

      <div className="absolute top-4 right-4 z-1000 pointer-events-auto translate-x-5">
        <MapControl mapStyle={mapStyle} setMapStyle={setMapStyle} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default MapSection;
