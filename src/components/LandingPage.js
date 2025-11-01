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
        color: "#FFF8E7",
        fontFamily: "'Playfair Display', serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background:
          "radial-gradient(circle at center, #FFF8E7 0%, #0B3D20 80%)",
      }}
    >
      {/* Background Leaflet map dims behind */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          filter: "brightness(0.3) contrast(1.2)",
        }}
      >
        <MapContainer
          center={[37.7749, -122.4194]}
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
            "radial-gradient(circle, rgba(11,61,32,0.6), rgba(62,38,23,0.8) 70%)",
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
            fontFamily: "'Playfair Display', serif",
            textTransform: "uppercase",
            textShadow: "0 6px 12px rgba(0,0,0,0.5)",
          }}
        >
          Paros
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "1.5rem",
            marginTop: "2rem",
            fontWeight: 400,
            fontFamily: "'Gilroy', 'Comfortaa', sans-serif",
            letterSpacing: "0.1em",
            userSelect: "none",
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Connect. Grow. Thrive.
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.1, boxShadow: "0 0 40px 6px #F9D342" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLoginSuccess({ username: "guest" })}
          style={{
            marginTop: "4rem",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "1.2rem 3.5rem",
            borderRadius: 40,
            border: "none",
            cursor: "pointer",
            backgroundColor: "#3E2617",
            color: "#FFF8E7",
            boxShadow: "0 0 30px rgba(62, 38, 23, 0.5)",
            fontFamily: "'Gilroy', 'Comfortaa', sans-serif",
            userSelect: "none",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9D342")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3E2617")}
          aria-label="Begin your journey"
        >
          Begin Your Journey
        </motion.button>
      </motion.div>
    </section>
  );
}
