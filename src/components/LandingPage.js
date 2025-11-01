import React from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

import "../index.css"; // Your global CSS with new palette and fonts

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function LandingPage({ onLoginSuccess }) {
  return (
    <section
      className="landing-section"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background:
          "radial-gradient(circle at center, #F7F6F3 0%, #004d40 80%)",
      }}
    >
      {/* Background Leaflet map dims behind */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          filter: "brightness(0.5) contrast(1.2)",
        }}
      >
        <MapContainer
          center={[18.5204, 73.8567]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
          keyboard={false}
          boxZoom={false}
          tap={false}
          touchZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

      {/* Dark vignette overlay for depth */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(0,77,64,0.6), rgba(35,26,19,0.8) 70%)",
          zIndex: 1,
        }}
      />



      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 10, maxWidth: 720, padding: "0 1rem" }}
      >
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: "6rem",
            fontWeight: 900,
            letterSpacing: "0.2em",
            margin: 0,
            userSelect: "none",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            color: "#F5F1E7",
            textShadow: "0 0 20px rgba(0,0,0,0.8), 0 6px 12px rgba(0,0,0,0.5)",
          }}
        >
          Paros
        </motion.h1>

          <motion.p
          variants={itemVariants}
          style={{
            fontSize: "1.5rem",
            marginTop: "1rem",
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.1em",
            userSelect: "none",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            color: "#F5F1E7",
            textShadow: "0 0 10px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Connect. Grow. Thrive.
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLoginSuccess({ username: "guest" })}
          style={{
            marginTop: "2rem",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "1.2rem 3.5rem",
            borderRadius: 0,
            border: "2px solid #004d40",
            cursor: "pointer",
            backgroundColor: "#FFFFFF",
            color: "#004d40",
            fontFamily: "'Inter', sans-serif",
            userSelect: "none",
          }}
          aria-label="Begin your journey"
        >
          Begin Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
}
