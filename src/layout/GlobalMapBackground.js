import React from "react";
import { motion, useScroll } from "framer-motion";
import { MapContainer, TileLayer } from "react-leaflet";

// Global Map Background Component
const GlobalMapBackground = ({ isDarkMode, user }) => {
  const mapRef = React.useRef();
  const { scrollYProgress } = useScroll();

  const getUserCoordinates = () => [18.5204, 73.8567];

  const [userLat, userLng] = getUserCoordinates();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (mapRef.current) {
        const startLat = userLat;
        const endLat = userLat - 0.13;
        const lat = startLat + (endLat - startLat) * progress;
        const lng = userLng;
        try {
          mapRef.current.setView([lat, lng], 14, { animate: true, duration: 0.5 });
        } catch (error) {
          // Silent fail
        }
      }
    });
    return unsubscribe;
  }, [scrollYProgress, userLat, userLng]);

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        height: "100vh",
        width: "100vw"
      }}>
        <MapContainer
          ref={mapRef}
          center={[userLat, userLng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "100vh", width: "100vw" }}
          attributionControl={false}
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
          keyboard={false}
          boxZoom={false}
        >
          <TileLayer
            url={isDarkMode ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
        </MapContainer>
      </div>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
        pointerEvents: "none"
      }} />
    </>
  );
};

export default GlobalMapBackground;
