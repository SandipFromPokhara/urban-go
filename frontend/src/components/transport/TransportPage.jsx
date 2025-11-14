// TransportPage.jsx
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import HeroSection from "./HeroSection";
import SearchArea from "./SearchArea";
import LocateButton from "./LocateButton";
import "leaflet/dist/leaflet.css";

function TransportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState([
    { position: [60.1699, 24.9384], name: "Central Station", info: "Main hub" },
    { position: [60.1921, 24.9458], name: "Töölö", info: "Residential area" },
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Body Section */}
      <section className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left Column: Search Area */}
          <div className="w-full md:w-2/5 h-full">
            <SearchArea
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              routes={routes}
              setRoutes={setRoutes}
            />
          </div>

          {/* Right Column: Leaflet Map */}
          <div className="relative w-full md:w-3/5 h-[600px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[60.1699, 24.9384]}
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

              {/* Locate Button MUST be inside MapContainer */}
              <LocateButton />
            </MapContainer>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TransportPage;
