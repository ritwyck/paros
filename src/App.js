import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

import "./index.css";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Community Help System Data
const dummyListings = [
  {
    id: 1,
    title: "Garden Help Needed",
    category: "service",
    type: "help",
    description: "Need help with weeding and planting in my backyard garden. Happy to pay $20/hour or trade fresh vegetables!",
    location: "Downtown",
    helper: "Maria G.",
    lastActive: "2 hours ago",
    compensation: "$20/hr or barter"
  },
  {
    id: 2,
    title: "Guitar Lessons Available",
    category: "skill",
    type: "teach",
    description: "Experienced guitarist offering lessons for beginners. $25 per hour, flexible scheduling.",
    location: "Westside",
    helper: "Alex R.",
    lastActive: "5 hours ago",
    compensation: "$25/hour"
  },
  {
    id: 3,
    title: "Lawn Mower Available",
    category: "lend",
    type: "borrow",
    description: "Electric lawn mower in great condition. Available to borrow for $10/day. Gas included.",
    location: "Eastside",
    helper: "David K.",
    lastActive: "1 day ago",
    compensation: "$10/day"
  }
];

const dummyEvents = [
  {
    id: 1,
    title: "Community Gardening Day",
    date: "2025-11-05",
    time: "09:00 - 17:00",
    location: "Riverside Park, pavilion area",
    description: "Join our community garden transformation! Bring gardening tools, gloves, and water bottles.",
    curator: "Community Council",
    attendees: ["Maria G.", "Carlos L.", "Sophie W.", "+12 more"],
    category: "gardening",
    lastActive: "Featured"
  }
];

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

// Natural Luxury Dashboard Component
const Dashboard = ({ user, isDarkMode, onNavigate, listings, events }) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: isMobile ? "2rem 1rem 4rem" : "3rem 2rem 5rem",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Transparent Welcome Section - Map shows through */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "2rem" : "4rem",
          padding: isMobile ? "2rem 0" : "3rem 0"
        }}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "inline-block",
            padding: isMobile ? "1.5rem 2rem" : "2rem 3rem",
            background: "rgba(232, 220, 192, 0.9)",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(232, 220, 192, 0.25)",
            border: "1px solid rgba(232, 220, 192, 0.3)",
            backdropFilter: "blur(10px)"
          }}
        >
          <h1 style={{
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            fontWeight: 500,
            color: "#231a13",
            margin: 0,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif"
          }}>
            Welcome Back, {user.username || "Neighbor"}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: isMobile ? "1rem" : "1.2rem",
            color: "#231a13",
            margin: isMobile ? "1.5rem auto 0" : "2rem auto 0",
            fontWeight: 400,
            maxWidth: isMobile ? "90%" : "500px",
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          Discover meaningful connections in your community
        </motion.p>
      </motion.div>

      {/* Luxury Activity Cards */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(380px, 1fr))",
        gap: isMobile ? "2rem" : "3rem",
        padding: isMobile ? "0 1rem" : "0 2rem"
      }}>
        {/* Community Impact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          whileHover={{
            y: isMobile ? 0 : -8,
            boxShadow: isMobile ? "0 8px 32px rgba(0,0,0,0.08)" : "0 25px 50px rgba(0,0,0,0.15)",
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          style={{
            background: "white",
            borderRadius: isMobile ? "16px" : "20px",
            padding: isMobile ? "2rem" : "3rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(249, 245, 237, 0.6)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            background: "radial-gradient(circle, rgba(232,220,192,0.08) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(232,220,192,0.06) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />

          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
            position: "relative",
            zIndex: 1
          }}>
            <div style={{
              width: isMobile ? "48px" : "56px",
              height: isMobile ? "48px" : "56px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1.5rem",
              boxShadow: "0 4px 16px rgba(232, 220, 192, 0.3)",
              border: "2px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{
                width: "24px",
                height: "24px",
                background: "#231a13",
                borderRadius: "2px",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  width: "12px",
                  height: "2px",
                  background: "#E8DCC0",
                  top: "6px",
                  left: "6px"
                }} />
                <div style={{
                  position: "absolute",
                  width: "2px",
                  height: "12px",
                  background: "#E8DCC0",
                  top: "6px",
                  right: "6px"
                }} />
              </div>
            </div>
            <div>
              <h3 style={{
                fontSize: isMobile ? "1.4rem" : "1.6rem",
                fontWeight: 600,
                color: "#231a13",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.01em"
              }}>
                Your Community Impact
              </h3>
              <p style={{
                fontSize: isMobile ? "0.9rem" : "1rem",
                color: "#666",
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                Building stronger connections
              </p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gap: "1.5rem",
            position: "relative",
            zIndex: 1
          }}>
            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: isMobile ? "1.25rem" : "1.5rem",
                background: "linear-gradient(135deg, rgba(232,220,192,0.1) 0%, rgba(232,220,192,0.05) 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(232,220,192,0.2)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{
                color: "#231a13",
                fontWeight: 500,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Help Offered
              </span>
              <span style={{
                fontSize: isMobile ? "1.3rem" : "1.4rem",
                fontWeight: 700,
                color: "#231a13",
                fontFamily: "'Inter', sans-serif"
              }}>
                {listings.filter(l => l.helper === user.username || l.helper?.split('.')[0] === user.username?.charAt(0)).length}
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: isMobile ? "1.25rem" : "1.5rem",
                background: "linear-gradient(135deg, rgba(232,220,192,0.1) 0%, rgba(232,220,192,0.05) 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(232,220,192,0.2)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{
                color: "#231a13",
                fontWeight: 500,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Help Received
              </span>
              <span style={{
                fontSize: isMobile ? "1.3rem" : "1.4rem",
                fontWeight: 700,
                color: "#231a13",
                fontFamily: "'Inter', sans-serif"
              }}>
                {Math.floor(Math.random() * 5) + 1}
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: isMobile ? "1.25rem" : "1.5rem",
                background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(232,220,192,0.3)",
                boxShadow: "0 4px 16px rgba(232, 220, 192, 0.2)",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{
                color: "#231a13",
                fontWeight: 500,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Community Trust
              </span>
              <span style={{
                fontSize: isMobile ? "1.3rem" : "1.4rem",
                fontWeight: 700,
                color: "#231a13",
                fontFamily: "'Inter', sans-serif"
              }}>
                5.0
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Elegant Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{
            y: isMobile ? 0 : -8,
            boxShadow: isMobile ? "0 8px 32px rgba(0,0,0,0.08)" : "0 25px 50px rgba(0,0,0,0.15)",
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          style={{
            background: "white",
            borderRadius: isMobile ? "16px" : "20px",
            padding: isMobile ? "2rem" : "3rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(249, 245, 237, 0.6)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{
            position: "absolute",
            top: "-40px",
            left: "-40px",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(102,126,234,0.06) 0%, transparent 70%)",
            borderRadius: "50%"
          }} />

          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
            position: "relative",
            zIndex: 1
          }}>
            <div style={{
              width: isMobile ? "48px" : "56px",
              height: isMobile ? "48px" : "56px",
              borderRadius: "18px",
              background: "#8B7355",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1.5rem",
              boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)",
              border: "2px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid white",
                borderRadius: "2px",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  width: "8px",
                  height: "2px",
                  background: "white",
                  top: "7px",
                  left: "4px"
                }} />
                <div style={{
                  position: "absolute",
                  width: "2px",
                  height: "8px",
                  background: "white",
                  top: "4px",
                  right: "4px"
                }} />
              </div>
            </div>
            <div>
              <h3 style={{
                fontSize: isMobile ? "1.4rem" : "1.6rem",
                fontWeight: 600,
                color: "#231a13",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.01em"
              }}>
                Quick Actions
              </h3>
              <p style={{
                fontSize: isMobile ? "0.9rem" : "1rem",
                color: "#666",
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                Explore your community
              </p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gap: "1rem",
            position: "relative",
            zIndex: 1
          }}>
            <motion.button
              whileHover={{
                scale: isMobile ? 1 : 1.03
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("browse")}
              style={{
                background: "#8B7355",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: isMobile ? "1rem 1.5rem" : "1.2rem 2rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.3s ease"
              }}
            >
              Browse Community Help
            </motion.button>

            <motion.button
              whileHover={{
                scale: isMobile ? 1 : 1.03,
                backgroundColor: "#8B7355",
                color: "white"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("profile")}
              style={{
                background: "white",
                color: "#8B7355",
                border: "none",
                borderRadius: "12px",
                padding: isMobile ? "1rem 1.5rem" : "1.2rem 2rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.3s ease"
              }}
            >
              Update Your Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

    {/* Luxury Community Showcase */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        maxWidth: "1400px",
        margin: "5rem auto 0",
        padding: "0 2rem"
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          fontSize: "2.2rem",
          fontWeight: 600,
          color: "#231a13",
          textAlign: "center",
          marginBottom: "3rem",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.01em"
        }}
      >
        Community Showcase
      </motion.h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "3rem"
      }}>
        {/* Local Opportunities */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#231a13",
              marginBottom: "2rem",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.01em"
            }}
          >
            Local Opportunities
          </motion.h3>
          {listings.slice(0, 2).map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                y: -2
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid rgba(249, 245, 237, 0.6)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: "radial-gradient(circle, rgba(232,220,192,0.08) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(30px, -30px)"
              }} />

              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.5rem",
                position: "relative",
                zIndex: 1
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                  boxShadow: "0 3px 12px rgba(232, 220, 192, 0.3)",
                  border: "2px solid rgba(255,255,255,0.8)"
                }}>
                  {listing.category === "service" ? "TOOL" : listing.category === "skill" ? "ART" : "BOX"}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: "0 0 0.75rem 0",
                    color: "#231a13",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {listing.title}
                  </h4>
                  <p style={{
                    margin: "0 0 1.5rem 0",
                    color: "#666",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {listing.description.substring(0, 90)}...
                  </p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#E8DCC0"
                      }} />
                      <small style={{
                        color: "#999",
                        fontSize: "0.9rem",
                        fontFamily: "'Inter', sans-serif"
                      }}>
                        {listing.helper} • {listing.lastActive}
                      </small>
                    </div>
                  <span style={{
                    background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
                    color: "#231a13",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {listing.compensation}
                  </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Events */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#231a13",
              marginBottom: "2rem",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.01em"
            }}
          >
            Community Events
          </motion.h3>
          {events.slice(0, 2).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                y: -2
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid rgba(249, 245, 237, 0.6)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "80px",
                height: "80px",
                background: "radial-gradient(circle, rgba(102,126,234,0.06) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(-30px, -30px)"
              }} />

              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1.5rem",
                position: "relative",
                zIndex: 1
              }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background: "#8B7355",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
                boxShadow: "0 3px 12px rgba(139, 115, 85, 0.3)",
                border: "2px solid rgba(255,255,255,0.8)"
              }}>
                CALENDAR
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: "0 0 0.75rem 0",
                  color: "#231a13",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {event.title}
                </h4>
                <p style={{
                  margin: "0 0 1.5rem 0",
                  color: "#666",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {event.description.substring(0, 90)}...
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#8B7355"
                    }} />
                    <small style={{
                      color: "#999",
                      fontSize: "0.9rem",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {event.curator} • {event.lastActive}
                    </small>
                  </div>
                  <span style={{
                    background: "#8B7355",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {event.date}
                  </span>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);
};

// Luxury Swipeable Listings Component
const SwipeableListings = ({ listings, isDarkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(prevIndex => {
      if (newDirection === 1) {
        return prevIndex + 1 >= listings.length ? 0 : prevIndex + 1;
      } else {
        return prevIndex + 1 >= listings.length ? 0 : prevIndex + 1;
      }
    });
  };

  const currentListing = listings[currentIndex];

  if (!currentListing) return null;

  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: "2rem 1rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fefefe 0%, #f8f6f0 100%)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "1rem 0"
        }}
      >
        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: 600,
          color: "#231a13",
          margin: 0,
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif"
        }}>
          Discover Community Help
        </h1>
        <p style={{
          fontSize: "1rem",
          color: "#666",
          margin: "0.5rem 0 0 0",
          fontWeight: 400,
          fontFamily: "'Inter', sans-serif"
        }}>
          Swipe to find the perfect match for your needs
        </p>
      </motion.div>

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "380px",
        height: "520px",
        marginBottom: "2rem"
      }}>
        {[2, 1].map((offset) => {
          const listing = listings[(currentIndex + offset) % listings.length];
          if (!listing) return null;

          return (
            <motion.div
              key={`bg-${offset}`}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.9)",
                transform: `scale(${1 - offset * 0.05}) translateY(${offset * 8}px)`,
                zIndex: 1 - offset,
                opacity: 0.7
              }}
            />
          );
        })}

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateY: 10 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(-1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(1);
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.9)",
            cursor: "grab",
            zIndex: 10,
            overflow: "hidden"
          }}
        >
          <div style={{
            padding: "2rem 2rem 1rem",
            borderBottom: "1px solid rgba(232,220,192,0.2)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem"
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow: "0 3px 12px rgba(232, 220, 192, 0.3)",
                border: "2px solid rgba(255,255,255,0.8)"
              }}>
                {currentListing.category === "service" ? "TOOL" :
                 currentListing.category === "skill" ? "ART" : "BOX"}
              </div>
              <div>
                <div style={{
                  background: "#8B7355",
                  color: "white",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "inline-block",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {currentListing.category}
                </div>
                <p style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  margin: "0.5rem 0 0 0",
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {currentListing.location} • {currentListing.lastActive}
                </p>
              </div>
            </div>
          </div>

          <div style={{
            padding: "1.5rem 2rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h2 style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#231a13",
                margin: "0 0 1rem 0",
                lineHeight: 1.3,
                fontFamily: "'Inter', sans-serif"
              }}>
                {currentListing.title}
              </h2>

              <p style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "#555",
                margin: 0,
                flex: 1,
                fontFamily: "'Inter', sans-serif"
              }}>
                {currentListing.description}
              </p>
            </div>

            <div style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(232,220,192,0.2)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#8B7355",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem"
                  }}>
                    USER
                  </div>
                  <div>
                    <p style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#231a13",
                      margin: 0,
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {currentListing.helper}
                    </p>
                    <p style={{
                      fontSize: "0.8rem",
                      color: "#999",
                      margin: "0.1rem 0 0 0",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Helper
                    </p>
                  </div>
                </div>

                <div style={{
                  background: "#8B7355",
                  color: "white",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "16px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textAlign: "center",
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {currentListing.compensation}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{
        display: "flex",
        gap: "3rem",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "none",
            background: "#CD853F",
            color: "white",
            fontSize: "1.8rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          ✕
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "none",
            background: "#A0522D",
            color: "white",
            fontSize: "1.8rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          ♥
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "0.95rem",
          fontWeight: 500,
          maxWidth: "300px",
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        Swipe right to connect • Swipe left to skip
        <br />
        <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          Find the perfect community match for your needs
        </span>
      </motion.div>
    </div>
  );
};

// Clean Navigation Component with Responsive Design
const CleanNavigation = ({ currentPage, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "browse", label: "Listings" },
    { key: "events", label: "Events" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          background: "rgba(251, 248, 241, 0.95)",
          backdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(249, 245, 237, 0.4)",
          padding: isMobile ? "1rem" : "1.5rem 2rem",
          boxShadow: "none"
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative"
        }}>
          <h1 style={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            fontWeight: 600,
            color: "#231a13",
            cursor: "pointer",
            margin: 0,
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            Paros
          </h1>

          {/* Desktop Navigation - Show on tablets and up */}
          {!isMobile && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem"
            }}>
              {menuItems.map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(item.key)}
                  style={{
                    background: "none !important",
                    border: "none !important",
                    color: currentPage === item.key ? "#8B7355" : "#231a13",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: currentPage === item.key ? 600 : 500,
                    fontFamily: "'Inter', sans-serif",
                    padding: "0.5rem 1rem",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    textShadow: currentPage === item.key ? "0 1px 2px rgba(139, 115, 85, 0.3)" : "none",
                    boxShadow: "none !important",
                    outline: "none !important"
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.key) {
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {item.label}
                </motion.button>
              ))}

              <div style={{
                width: "1px",
                height: "24px",
                background: "rgba(249, 245, 237, 0.4)",
                margin: "0 1rem"
              }} />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#231a13",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  padding: "0.5rem 1rem",
                  transition: "all 0.3s ease",
                  textDecoration: "none"
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                Sign Out
              </motion.button>
            </div>
          )}

          {/* Mobile Hamburger Menu Button - Only show on mobile */}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#231a13",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontFamily: "'Inter', sans-serif",
                zIndex: 1001
              }}
            >
              <div style={{
                width: "20px",
                height: "2px",
                background: "#231a13",
                transition: "all 0.3s ease",
                transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none"
              }} />
              <div style={{
                width: "20px",
                height: "2px",
                background: "#231a13",
                transition: "all 0.3s ease",
                opacity: isMenuOpen ? 0 : 1
              }} />
              <div style={{
                width: "20px",
                height: "2px",
                background: "#231a13",
                transition: "all 0.3s ease",
                transform: isMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none"
              }} />
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu Overlay - Only show on mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            scale: isMenuOpen ? 1 : 0.95
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: "60px",
            right: "1rem",
            zIndex: 1000,
            background: "rgba(251, 248, 241, 0.98)",
            backdropFilter: "blur(30px)",
            borderRadius: "12px",
            border: "1px solid rgba(249, 245, 237, 0.4)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            minWidth: "200px",
            pointerEvents: isMenuOpen ? "auto" : "none",
            transformOrigin: "top right"
          }}
        >
          <div style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            {menuItems.map((item) => (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onNavigate(item.key);
                  setIsMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: currentPage === item.key ? "#8B7355" : "#231a13",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: currentPage === item.key ? 600 : 500,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  borderBottom: currentPage === item.key ? "2px solid #8B7355" : "2px solid transparent",
                  borderRadius: "6px"
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.key) {
                    e.target.style.textDecoration = "underline";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                {item.label}
              </motion.button>
            ))}

            <div style={{
              borderTop: "1px solid rgba(249, 245, 237, 0.4)",
              margin: "0.5rem 0",
              paddingTop: "0.5rem"
            }} />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#231a13",
                padding: "0.75rem 1rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                textAlign: "left",
                transition: "all 0.3s ease",
                textDecoration: "none",
                borderRadius: "6px"
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
};

// Responsive Footer Component
const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer style={{
      position: "relative",
      backgroundColor: "#000000",
      color: "#F5F1E7",
      padding: isMobile ? "2rem 1rem 1rem" : "3rem 1rem 2rem",
      textAlign: "center",
      fontFamily: "'Inter', sans-serif",
      zIndex: 10,
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
        zIndex: -1,
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
        gap: isMobile ? "2rem" : "2rem",
        marginBottom: isMobile ? "1.5rem" : "2rem",
      }}>
        <div>
          <h3 style={{
            color: "#F5F1E7",
            marginBottom: "1rem",
            fontSize: isMobile ? "1.2rem" : "1.5rem",
            fontWeight: 700
          }}>
            Paros Community
          </h3>
          <p style={{
            color: "#F5F1E7",
            opacity: 0.9,
            lineHeight: 1.6,
            fontSize: isMobile ? "0.9rem" : "1rem"
          }}>
            Connecting neighbors through mutual help, skills, and shared resources.
          </p>
        </div>

        <div>
          <h4 style={{
            color: "#F5F1E7",
            marginBottom: "1rem",
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.2rem"
          }}>
            Help & Services
          </h4>
          <ul style={{
            listStyle: "none",
            padding: 0,
            textAlign: "left"
          }}>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Skill Sharing
            </li>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Errand Running
            </li>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Home Repairs
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{
            color: "#F5F1E7",
            marginBottom: "1rem",
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.2rem"
          }}>
            Lend & Borrow
          </h4>
          <ul style={{
            listStyle: "none",
            padding: 0,
            textAlign: "left"
          }}>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Tools & Equipment
            </li>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Community Spaces
            </li>
            <li style={{
              color: "#F5F1E7",
              marginBottom: "0.5rem",
              opacity: 0.9,
              fontSize: isMobile ? "0.9rem" : "1rem"
            }}>
              Transportation
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{
            color: "#F5F1E7",
            marginBottom: "1rem",
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.2rem"
          }}>
            Community Spirit
          </h4>
          <p style={{
            color: "#F5F1E7",
            opacity: 0.9,
            fontSize: isMobile ? "0.85rem" : "0.9rem",
            lineHeight: 1.5,
            textAlign: "left"
          }}>
            "Stronger together - helping neighbors, building community"
          </p>
        </div>
      </div>

      <div style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(245, 241, 231, 0.3)",
        paddingTop: isMobile ? "1rem" : "2rem",
      }}>
        <p style={{
          color: "#F5F1E7",
          opacity: 0.8,
          fontSize: isMobile ? "0.85rem" : "1rem"
        }}>
          © 2025 Paros. Building stronger communities, one connection at a time.
        </p>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const isDarkMode = false;

  function onLoginSuccess(userData) {
    setUser(userData);
    setPage("profile");
  }

  function handleLogout() {
    setUser(null);
    setPage("dashboard");
  }

  const navigateTo = (pageName) => setPage(pageName);

  if (!user) {
    return <LandingPage onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
      <GlobalMapBackground isDarkMode={isDarkMode} user={user} />
      <CleanNavigation
        currentPage={page}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      <div style={{ overflowX: "hidden", marginTop: "120px" }}>
        {page === "dashboard" && (
          <Dashboard user={user} isDarkMode={isDarkMode} onNavigate={navigateTo} listings={dummyListings} events={dummyEvents} />
        )}
        {page === "profile" && <UserProfile user={user} setUser={setUser} isDarkMode={isDarkMode} />}
        {page === "browse" && <SwipeableListings listings={dummyListings} isDarkMode={isDarkMode} />}
        {page === "events" && <Events events={dummyEvents} isDarkMode={isDarkMode} />}
        {page === "create" && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Create New Masterpiece Coming Soon</h2>
            <p>This feature will allow you to create new listings and events.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
