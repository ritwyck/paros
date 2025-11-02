import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import Events from "./components/Events";
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
const dummyUsers = [
  {
    id: 1,
    username: "maria_g",
    preferredName: "Maria",
    country: "Netherlands",
    province: "North Holland",
    city: "Amsterdam",
    pinCode: "1012",
    aboutMe: "Passionate gardener and community organizer. Love helping neighbors grow their own food!",
    skills: ["Gardening & Landscaping", "Cooking & Baking"],
    customSkills: [],
    lendingItems: ["Garden Tools"],
    customLending: [],
    barterPreferences: "Happy to trade gardening help for cooking lessons or fresh produce.",
    profileImages: [null, null, null, null, null, null],
    trustScore: 4.8,
    joinDate: "2024-03-15"
  },
  {
    id: 2,
    username: "alex_r",
    preferredName: "Alex",
    country: "Netherlands",
    province: "North Holland",
    city: "Amsterdam",
    pinCode: "1015",
    aboutMe: "Professional musician and teacher. Love sharing the joy of music with the community.",
    skills: ["Music Lessons", "Tutoring & Teaching"],
    customSkills: ["Guitar Instruction"],
    lendingItems: ["Musical Instruments"],
    customLending: [],
    barterPreferences: "Prefer cash but open to music-related trades.",
    profileImages: [null, null, null, null, null, null],
    trustScore: 4.9,
    joinDate: "2024-01-20"
  },
  {
    id: 3,
    username: "david_k",
    preferredName: "David",
    country: "Netherlands",
    province: "North Holland",
    city: "Amsterdam",
    pinCode: "1017",
    aboutMe: "DIY enthusiast and tool collector. Always happy to lend a hand (or a tool)!",
    skills: ["Home Repairs & Maintenance", "Carpentry & Woodworking"],
    customSkills: [],
    lendingItems: ["Power Tools", "Lawn Equipment"],
    customLending: ["Cordless Drill Set"],
    barterPreferences: "Love tool swaps and repair work trades.",
    profileImages: [null, null, null, null, null, null],
    trustScore: 4.7,
    joinDate: "2024-05-10"
  },
  {
    id: 4,
    username: "community_council",
    preferredName: "Community Council",
    country: "Netherlands",
    province: "North Holland",
    city: "Amsterdam",
    pinCode: "1011",
    aboutMe: "Official community organization coordinating events and initiatives for our neighborhood.",
    skills: ["Event Planning", "Community Organization"],
    customSkills: [],
    lendingItems: ["Party Supplies", "Community Spaces"],
    customLending: [],
    barterPreferences: "Non-profit organization - all services are free to community members.",
    profileImages: [null, null, null, null, null, null],
    trustScore: 5.0,
    joinDate: "2023-01-01"
  }
];

const dummyListings = [
  {
    id: 1,
    title: "Garden Help Needed",
    category: "service",
    type: "help",
    description: "Need help with weeding and planting in my backyard garden. Happy to pay $20/hour or trade fresh vegetables!",
    location: "Downtown",
    helper: "Maria G.",
    helperId: 1,
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
    helperId: 2,
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
    helperId: 3,
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
    curatorId: 4,
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
const Dashboard = ({ user, isDarkMode, onNavigate, listings, events, onMessage, onReport, users }) => {
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
        padding: isMobile ? "0 1rem" : "0 2rem",
        marginLeft: isMobile ? "-0.5rem" : "-1rem"
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
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
        gap: isMobile ? "2rem" : "3rem"
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
                    alignItems: "flex-start"
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
                        {listing.helper} • {listing.location} • {listing.lastActive}
                      </small>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
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
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMessage({ id: listing.helperId, name: listing.helper });
                          }}
                          style={{
                            background: "#8B7355",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          Message
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReport({ id: listing.helperId, name: listing.helper, username: listing.helper.toLowerCase().replace(' ', '_') });
                          }}
                          style={{
                            background: "transparent",
                            color: "#666",
                            border: "1px solid #E8DCC0",
                            borderRadius: "12px",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          Report
                        </motion.button>
                      </div>
                    </div>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
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
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMessage({ id: event.curatorId, name: event.curator });
                        }}
                        style={{
                          background: "#8B7355",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif"
                        }}
                      >
                        Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReport({ id: event.curatorId, name: event.curator, username: event.curator.toLowerCase().replace(' ', '_') });
                        }}
                        style={{
                          background: "transparent",
                          color: "#666",
                          border: "1px solid #E8DCC0",
                          borderRadius: "12px",
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif"
                        }}
                      >
                        Report
                      </motion.button>
                    </div>
                  </div>
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

// Messages Page Component
const MessagesPage = ({ currentUser, users, onMessage }) => {
  const [conversations, setConversations] = useState([]);

  React.useEffect(() => {
    // Find all conversations for the current user
    const userConversations = [];

    users.forEach(otherUser => {
      if (otherUser.id !== currentUser.id) {
        // Use consistent key ordering (smaller ID first)
        const conversationKey = `messages_v2_${Math.min(currentUser.id, otherUser.id)}_${Math.max(currentUser.id, otherUser.id)}`;
        const messages = localStorage.getItem(conversationKey);

        if (messages) {
          const parsedMessages = JSON.parse(messages);
          if (parsedMessages.length > 0) {
            // Sort messages by timestamp and get the last one
            parsedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const lastMessage = parsedMessages[parsedMessages.length - 1];

            userConversations.push({
              user: otherUser,
              lastMessage,
              messageCount: parsedMessages.length,
              lastMessageTime: new Date(lastMessage.timestamp)
            });
          }
        }
      }
    });

    // Sort by most recent message
    userConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    setConversations(userConversations);
  }, [currentUser, users]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
            Your Messages
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
          Connect with your community members
        </motion.p>
      </motion.div>

      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "grid",
        gap: "1rem"
      }}>
        {conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid rgba(249, 245, 237, 0.6)"
            }}
          >
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2rem",
              color: "#E8DCC0"
            }}>
              0
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>No messages yet</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
              Start conversations by messaging people from listings and events!
            </p>
          </motion.div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => onMessage(conversation.user)}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
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
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                zIndex: 1
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#8B7355",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)"
                }}>
                  {conversation.user.preferredName?.charAt(0) || conversation.user.username?.charAt(0)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: "#231a13",
                      fontSize: "1.3rem",
                      fontWeight: 600
                    }}>
                      {conversation.user.preferredName || conversation.user.username}
                    </h3>
                    <span style={{
                      color: "#999",
                      fontSize: "0.9rem",
                      fontWeight: 500
                    }}>
                      {conversation.lastMessageTime.toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{
                    margin: "0 0 0.5rem 0",
                    color: "#666",
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {conversation.lastMessage.text}
                  </p>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <span style={{
                      background: "#E8DCC0",
                      color: "#231a13",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}>
                      Trust Score: {conversation.user.trustScore}
                    </span>
                    <span style={{
                      color: "#999",
                      fontSize: "0.9rem"
                    }}>
                      {conversation.messageCount} message{conversation.messageCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div style={{
                  color: "#8B7355",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  →
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Swipeable Listings Component with Filters
const SwipeableListings = ({ listings, isDarkMode, onCreateListing, user, onMessage, onReport, users }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load watchlist from localStorage
  React.useEffect(() => {
    const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`);
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, [user.id]);

  // Get unique categories and locations
  const categories = [...new Set(listings.map(listing => listing.category))];
  const locations = [...new Set(listings.map(listing => listing.location))];

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.helper.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "" || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === "" || listing.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory ? 1 : 0) + (selectedLocation ? 1 : 0);

  const addToWatchlist = (itemId, type) => {
    const newItem = { id: itemId, type, dateAdded: new Date().toISOString() };
    const updatedWatchlist = [...watchlist, newItem];
    setWatchlist(updatedWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist));
  };

  const removeFromWatchlist = (itemId, type) => {
    const updatedWatchlist = watchlist.filter(item => !(item.id === itemId && item.type === type));
    setWatchlist(updatedWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist));
  };

  const isInWatchlist = (itemId, type) => {
    return watchlist.some(item => item.id === itemId && item.type === type);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(prevIndex => {
      if (newDirection === 1) {
        return prevIndex + 1 >= filteredListings.length ? 0 : prevIndex + 1;
      } else {
        return prevIndex + 1 >= filteredListings.length ? 0 : prevIndex + 1;
      }
    });
  };

  // Handle empty filtered results
  if (filteredListings.length === 0) {
    return (
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: isMobile ? "2rem 1rem 4rem" : "3rem 2rem 5rem",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "2rem" : "4rem"
          }}
        >
          <h1 style={{
            fontSize: isMobile ? "2rem" : "2.8rem",
            fontWeight: 600,
            color: "#231a13",
            margin: "0 0 1rem 0",
            letterSpacing: "0.02em",
            fontFamily: "'Inter', sans-serif"
          }}>
            Discover Community Help
          </h1>
          <p style={{
            fontSize: isMobile ? "1rem" : "1.2rem",
            color: "#666",
            margin: 0,
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif"
          }}>
            Find the perfect help for your needs
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateListing}
            style={{
              background: "#8B7355",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)",
              marginTop: "2rem"
            }}
          >
            + Create New Listing
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "3rem"
        }}>
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              position: "relative",
              marginBottom: "2rem"
            }}
          >
            <input
              type="text"
              placeholder="Search listings by title, description, or helper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 3rem 1rem 1rem",
                border: "2px solid #E8DCC0",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                background: "white"
              }}
            />
            <div style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              fontSize: "1.2rem"
            }}>
              SEARCH
            </div>
          </motion.div>

          {/* Filter Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltersOpen(!filtersOpen)}
                style={{
                  background: "white",
                  color: "#8B7355",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                FILTERS
                {activeFiltersCount > 0 && (
                  <span style={{
                    background: "#8B7355",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>

              {activeFiltersCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  style={{
                    background: "transparent",
                    color: "#666",
                    border: "1px solid #E8DCC0",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Clear All
                </motion.button>
              )}
            </div>

            <div style={{
              color: "#666",
              fontSize: "1rem",
              fontWeight: 500
            }}>
              Showing 0 of {listings.length} listings
            </div>
          </motion.div>

          {/* Filter Options */}
          <motion.div
            initial={false}
            animate={{
              height: filtersOpen ? "auto" : 0,
              opacity: filtersOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              marginBottom: "2rem"
            }}
          >
            <div style={{
              background: "white",
              border: "2px solid #E8DCC0",
              borderRadius: "12px",
              padding: "2rem",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem"
            }}>
              {/* Category Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  color: "#231a13",
                  fontSize: "1rem"
                }}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #E8DCC0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                    background: "white"
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  color: "#231a13",
                  fontSize: "1rem"
                }}>
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #E8DCC0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                    background: "white"
                  }}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* No Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid rgba(249, 245, 237, 0.6)",
            maxWidth: "600px",
            margin: "0 auto"
          }}
        >
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
            color: "#E8DCC0"
          }}>
            SEARCH
          </div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>No listings found</h3>
          <p style={{ margin: "0 0 2rem 0", color: "#666", fontSize: "1rem" }}>
            Try adjusting your search or filters to find more listings.
          </p>
          {activeFiltersCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              style={{
                background: "#8B7355",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "1rem 2rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  const currentListing = filteredListings[currentIndex];

  // Additional safety check for current listing
  if (!currentListing || !currentListing.id) {
    return (
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: "2rem 1rem 4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
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
            margin: "0.5rem 0 1rem 0",
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif"
          }}>
            No listings available at the moment.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: isMobile ? "2rem 1rem 4rem" : "3rem 2rem 5rem",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "2rem" : "4rem"
        }}
      >
        <h1 style={{
          fontSize: isMobile ? "2rem" : "2.8rem",
          fontWeight: 600,
          color: "#231a13",
          margin: "0 0 1rem 0",
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif"
        }}>
          Discover Community Help
        </h1>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          color: "#666",
          margin: 0,
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif"
        }}>
          Filter and swipe to find the perfect match for your needs
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateListing}
          style={{
            background: "#8B7355",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)",
            marginTop: "2rem"
          }}
        >
          + Create New Listing
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        marginBottom: "3rem"
      }}>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            position: "relative",
            marginBottom: "2rem"
          }}
        >
          <input
            type="text"
            placeholder="Search listings by title, description, or helper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 3rem 1rem 1rem",
              border: "2px solid #E8DCC0",
              borderRadius: "12px",
              fontSize: "1rem",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              background: "white"
            }}
          />
          <div style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#666",
            fontSize: "1.2rem"
          }}>
            SEARCH
          </div>
        </motion.div>

        {/* Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                background: "white",
                color: "#8B7355",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              FILTERS
              {activeFiltersCount > 0 && (
                <span style={{
                  background: "#8B7355",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>

            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                style={{
                  background: "transparent",
                  color: "#666",
                  border: "1px solid #E8DCC0",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Clear All
              </motion.button>
            )}
          </div>

          <div style={{
            color: "#666",
            fontSize: "1rem",
            fontWeight: 500
          }}>
            Showing {filteredListings.length} of {listings.length} listings
          </div>
        </motion.div>

        {/* Filter Options */}
        <motion.div
          initial={false}
          animate={{
            height: filtersOpen ? "auto" : 0,
            opacity: filtersOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{
            overflow: "hidden",
            marginBottom: "2rem"
          }}
        >
          <div style={{
            background: "white",
            border: "2px solid #E8DCC0",
            borderRadius: "12px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#231a13",
                fontSize: "1rem"
              }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  background: "white"
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#231a13",
                fontSize: "1rem"
              }}>
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  background: "white"
                }}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swipe Cards */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "2rem 0",
        position: "relative"
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          height: "550px",
          marginBottom: "2rem"
        }}>
          {[2, 1].map((offset) => {
            const listing = filteredListings[(currentIndex + offset) % filteredListings.length];
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
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem"
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (isInWatchlist(currentListing.id, 'listing')) {
                        removeFromWatchlist(currentListing.id, 'listing');
                      } else {
                        addToWatchlist(currentListing.id, 'listing');
                      }
                    }}
                    style={{
                      background: isInWatchlist(currentListing.id, 'listing') ? "#E8DCC0" : "transparent",
                      color: isInWatchlist(currentListing.id, 'listing') ? "#231a13" : "#666",
                      border: `2px solid ${isInWatchlist(currentListing.id, 'listing') ? "#E8DCC0" : "#E8DCC0"}`,
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isInWatchlist(currentListing.id, 'listing') ? "★" : "☆"}
                  </motion.button>
                </div>
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

        {/* Action Buttons and Instructions - positioned right below the card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem"
        }}>
          <div style={{
            display: "flex",
            gap: "3rem",
            alignItems: "center",
            justifyContent: "center"
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
      </div>
    </div>
  );
};

// Filterable Listings Component
const Listings = ({ listings, isDarkMode, onCreateListing, user, onMessage, onReport, users }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get unique categories and locations
  const categories = [...new Set(listings.map(listing => listing.category))];
  const locations = [...new Set(listings.map(listing => listing.location))];

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === "" ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.helper.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "" || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === "" || listing.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
  };

  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory ? 1 : 0) + (selectedLocation ? 1 : 0);

  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: isMobile ? "2rem 1rem 4rem" : "3rem 2rem 5rem",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "2rem" : "4rem"
        }}
      >
        <h1 style={{
          fontSize: isMobile ? "2rem" : "2.8rem",
          fontWeight: 600,
          color: "#231a13",
          margin: "0 0 1rem 0",
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif"
        }}>
          Community Help Listings
        </h1>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          color: "#666",
          margin: 0,
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif"
        }}>
          Find the perfect help for your needs
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateListing}
          style={{
            background: "#8B7355",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)",
            marginTop: "2rem"
          }}
        >
          + Create New Listing
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        marginBottom: "3rem"
      }}>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            position: "relative",
            marginBottom: "2rem"
          }}
        >
          <input
            type="text"
            placeholder="Search listings by title, description, or helper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem 3rem 1rem 1rem",
              border: "2px solid #E8DCC0",
              borderRadius: "12px",
              fontSize: "1rem",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              background: "white"
            }}
          />
          <div style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#666",
            fontSize: "1.2rem"
          }}>
            SEARCH
          </div>
        </motion.div>

        {/* Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                background: "white",
                color: "#8B7355",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              FILTERS
              {activeFiltersCount > 0 && (
                <span style={{
                  background: "#8B7355",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>

            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                style={{
                  background: "transparent",
                  color: "#666",
                  border: "1px solid #E8DCC0",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Clear All
              </motion.button>
            )}
          </div>

          <div style={{
            color: "#666",
            fontSize: "1rem",
            fontWeight: 500
          }}>
            Showing {filteredListings.length} of {listings.length} listings
          </div>
        </motion.div>

        {/* Filter Options */}
        <motion.div
          initial={false}
          animate={{
            height: filtersOpen ? "auto" : 0,
            opacity: filtersOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{
            overflow: "hidden",
            marginBottom: "2rem"
          }}
        >
          <div style={{
            background: "white",
            border: "2px solid #E8DCC0",
            borderRadius: "12px",
            padding: "2rem",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {/* Category Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#231a13",
                fontSize: "1rem"
              }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  background: "white"
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#231a13",
                fontSize: "1rem"
              }}>
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  background: "white"
                }}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid rgba(249, 245, 237, 0.6)",
            maxWidth: "600px",
            margin: "0 auto"
          }}
        >
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
            color: "#E8DCC0"
          }}>
            SEARCH
          </div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>No listings found</h3>
          <p style={{ margin: "0 0 2rem 0", color: "#666", fontSize: "1rem" }}>
            Try adjusting your search or filters to find more listings.
          </p>
          {activeFiltersCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              style={{
                background: "#8B7355",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "1rem 2rem",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
          gap: isMobile ? "1.5rem" : "2rem"
        }}>
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                y: -2
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
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
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem"
                  }}>
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
                    <div style={{
                      background: "#8B7355",
                      color: "white",
                      padding: "0.4rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {listing.category}
                    </div>
                  </div>
                  <p style={{
                    margin: "0 0 1.5rem 0",
                    color: "#666",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {listing.description.substring(0, 120)}...
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
                        {listing.helper} • {listing.location} • {listing.lastActive}
                      </small>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMessage({ id: listing.helperId, name: listing.helper });
                        }}
                        style={{
                          background: "#8B7355",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif"
                        }}
                      >
                        Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReport({ id: listing.helperId, name: listing.helper, username: listing.helper.toLowerCase().replace(' ', '_') });
                        }}
                        style={{
                          background: "transparent",
                          color: "#666",
                          border: "1px solid #E8DCC0",
                          borderRadius: "12px",
                          padding: "0.4rem 0.8rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif"
                        }}
                      >
                        Report
                      </motion.button>
                    </div>
                  </div>
                  <div style={{
                    marginTop: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(232,220,192,0.2)",
                    textAlign: "right"
                  }}>
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
      )}
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
    { key: "messages", label: "Messages" },
    { key: "browse", label: "Listings" },
    { key: "events", label: "Events" },
    { key: "watchlist", label: "Watchlist" },
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
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative"
        }}>
          {/* Left side - empty for balance */}
          <div style={{ width: isMobile ? "40px" : "0px" }} />

          {/* PAROS Logo - centered on mobile, left on desktop */}
          <h1 style={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            fontWeight: 600,
            color: "#231a13",
            cursor: "pointer",
            margin: 0,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            ...(isMobile ? {
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)"
            } : {})
          }}>
            Paros
          </h1>

          {/* Desktop Navigation - buttons grouped on the right */}
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

          {/* Mobile Hamburger Menu Button - positioned on the right */}
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

// Messaging Component
const MessagingModal = ({ isOpen, onClose, recipient, currentUser, users }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Load messages when recipient changes
  React.useEffect(() => {
    if (recipient && currentUser) {
      // Use consistent key ordering (smaller ID first)
      const conversationKey = `messages_v2_${Math.min(currentUser.id, recipient.id)}_${Math.max(currentUser.id, recipient.id)}`;
      const saved = localStorage.getItem(conversationKey);
      setMessages(saved ? JSON.parse(saved) : []);
    } else {
      setMessages([]);
    }
  }, [recipient, currentUser]);

  const recipientData = recipient ? users.find(u => u.id === recipient.id) : null;

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        recipientId: recipient.id,
        text: message.trim(),
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Use consistent key ordering (smaller ID first)
      const conversationKey = `messages_v2_${Math.min(currentUser.id, recipient.id)}_${Math.max(currentUser.id, recipient.id)}`;
      localStorage.setItem(conversationKey, JSON.stringify(updatedMessages));
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid #E8DCC0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#8B7355",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
              {recipientData?.preferredName?.charAt(0) || recipient.name?.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#231a13", fontSize: "1.2rem" }}>
                {recipientData?.preferredName || recipient.name}
              </h3>
              <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                Trust Score: {recipientData?.trustScore || "N/A"}
              </p>
              {recipientData?.joinDate && (
                <p style={{ margin: "0.1rem 0 0 0", color: "#666", fontSize: "0.8rem" }}>
                  Member since {new Date(recipientData.joinDate).toLocaleDateString()}
                  {(() => {
                    const joinDate = new Date(recipientData.joinDate);
                    const now = new Date();
                    const diffTime = Math.abs(now - joinDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 30) {
                      return ` (${diffDays} days ago)`;
                    } else if (diffDays < 365) {
                      const months = Math.floor(diffDays / 30);
                      return ` (${months} month${months > 1 ? 's' : ''} ago)`;
                    } else {
                      const years = Math.floor(diffDays / 365);
                      return ` (${years} year${years > 1 ? 's' : ''} ago)`;
                    }
                  })()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666",
              padding: "0.5rem"
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          maxHeight: "400px"
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              padding: "2rem",
              fontStyle: "italic"
            }}>
              Start a conversation with {recipientData?.preferredName || recipient.name}
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: msg.senderId === currentUser.id ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "70%",
                  padding: "0.75rem 1rem",
                  borderRadius: "18px",
                  background: msg.senderId === currentUser.id ? "#E8DCC0" : "#f5f5f5",
                  color: msg.senderId === currentUser.id ? "#231a13" : "#333",
                  fontSize: "0.9rem",
                  lineHeight: 1.4
                }}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "1rem",
          borderTop: "1px solid #E8DCC0",
          display: "flex",
          gap: "0.5rem"
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              border: "2px solid #E8DCC0",
              borderRadius: "25px",
              outline: "none",
              fontSize: "1rem"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: message.trim() ? "#8B7355" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: message.trim() ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Create Listing Modal Component
const CreateListingModal = ({ isOpen, onClose, currentUser }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [compensation, setCompensation] = useState("");
  const [location, setLocation] = useState("");

  const categories = [
    { value: "service", label: "Service Help" },
    { value: "skill", label: "Skill Teaching" },
    { value: "lend", label: "Lending Item" }
  ];

  const submitListing = () => {
    if (title.trim() && description.trim() && category && compensation.trim() && location.trim()) {
      const newListing = {
        id: Date.now(),
        title: title.trim(),
        category,
        type: category === "service" ? "help" : category === "skill" ? "teach" : "borrow",
        description: description.trim(),
        location: location.trim(),
        helper: currentUser.preferredName || currentUser.username,
        helperId: currentUser.id,
        lastActive: "just now",
        compensation: compensation.trim()
      };

      // In a real app, this would be sent to a server
      // For now, we'll just show a success message
      alert("Listing created successfully! It will be visible to the community soon.");
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setCompensation("");
      setLocation("");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "2rem"
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem 0", color: "#231a13" }}>Create New Listing</h2>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Garden Help Needed"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're offering or what help you need..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                resize: "vertical"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Downtown, Westside"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Compensation *
            </label>
            <input
              type="text"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="e.g., $20/hour, barter, free"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              color: "#666",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Cancel
          </button>
          <button
            onClick={submitListing}
            disabled={!title.trim() || !description.trim() || !category || !compensation.trim() || !location.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: (!title.trim() || !description.trim() || !category || !compensation.trim() || !location.trim()) ? "#ccc" : "#8B7355",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (!title.trim() || !description.trim() || !category || !compensation.trim() || !location.trim()) ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            Create Listing
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Create Event Modal Component
const CreateEventModal = ({ isOpen, onClose, currentUser }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { value: "gardening", label: "Gardening" },
    { value: "education", label: "Education" },
    { value: "social", label: "Social" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const submitEvent = () => {
    if (title.trim() && description.trim() && date && time && location.trim() && category) {
      const newEvent = {
        id: Date.now(),
        title: title.trim(),
        date,
        time,
        location: location.trim(),
        description: description.trim(),
        curator: currentUser.preferredName || currentUser.username,
        curatorId: currentUser.id,
        attendees: [`${currentUser.preferredName || currentUser.username}`],
        category,
        lastActive: "Featured"
      };

      // In a real app, this would be sent to a server
      // For now, we'll just show a success message
      alert("Event created successfully! It will be visible to the community soon.");
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setCategory("");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "2rem"
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem 0", color: "#231a13" }}>Create New Event</h2>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Community Gardening Day"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
                Time *
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 09:00 - 17:00"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Riverside Park, pavilion area"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event and what participants should bring..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                resize: "vertical"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              color: "#666",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Cancel
          </button>
          <button
            onClick={submitEvent}
            disabled={!title.trim() || !description.trim() || !date || !time || !location.trim() || !category}
            style={{
              padding: "0.75rem 1.5rem",
              background: (!title.trim() || !description.trim() || !date || !time || !location.trim() || !category) ? "#ccc" : "#8B7355",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (!title.trim() || !description.trim() || !date || !time || !location.trim() || !category) ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            Create Event
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Watchlist Component
const Watchlist = ({ user, isDarkMode, onMessage, onReport, users }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load watchlist from localStorage
  React.useEffect(() => {
    const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`);
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, [user.id]);

  const removeFromWatchlist = (itemId, type) => {
    const updatedWatchlist = watchlist.filter(item => !(item.id === itemId && item.type === type));
    setWatchlist(updatedWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist));
  };

  const getDummyListings = () => [
    {
      id: 1,
      title: "Garden Help Needed",
      category: "service",
      type: "help",
      description: "Need help with weeding and planting in my backyard garden. Happy to pay $20/hour or trade fresh vegetables!",
      location: "Downtown",
      helper: "Maria G.",
      helperId: 1,
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
      helperId: 2,
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
      helperId: 3,
      lastActive: "1 day ago",
      compensation: "$10/day"
    }
  ];

  const getDummyEvents = () => [
    {
      id: 1,
      title: "Community Gardening Day",
      date: "2025-11-05",
      time: "09:00 - 17:00",
      location: "Riverside Park, pavilion area",
      description: "Join our community garden transformation! Bring gardening tools, gloves, and water bottles.",
      curator: "Community Council",
      curatorId: 4,
      attendees: ["Maria G.", "Carlos L.", "Sophie W.", "+12 more"],
      category: "gardening",
      lastActive: "Featured"
    }
  ];

  const listings = getDummyListings();
  const events = getDummyEvents();

  const watchlistListings = watchlist.filter(item => item.type === 'listing').map(item =>
    listings.find(listing => listing.id === item.id)
  ).filter(Boolean);

  const watchlistEvents = watchlist.filter(item => item.type === 'event').map(item =>
    events.find(event => event.id === item.id)
  ).filter(Boolean);

  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: isMobile ? "2rem 1rem 4rem" : "3rem 2rem 5rem",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "2rem" : "4rem"
        }}
      >
        <h1 style={{
          fontSize: isMobile ? "2rem" : "2.8rem",
          fontWeight: 600,
          color: "#231a13",
          margin: "0 0 1rem 0",
          letterSpacing: "0.02em",
          fontFamily: "'Inter', sans-serif"
        }}>
          My Watchlist
        </h1>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          color: "#666",
          margin: 0,
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif"
        }}>
          Keep track of listings and events you're interested in
        </p>
      </motion.div>

      {/* Watchlist Content */}
      {watchlistListings.length === 0 && watchlistEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid rgba(249, 245, 237, 0.6)"
          }}
        >
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E8DCC0 0%, #D4C4A8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
            color: "#E8DCC0"
          }}>
            📌
          </div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>Your watchlist is empty</h3>
          <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
            Save listings and events you're interested in by clicking the bookmark icon
          </p>
        </motion.div>
      ) : (
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gap: isMobile ? "2rem" : "3rem"
        }}>
          {/* Saved Listings */}
          {watchlistListings.length > 0 && (
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  color: "#231a13",
                  marginBottom: "2rem",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em"
                }}
              >
                Saved Listings ({watchlistListings.length})
              </motion.h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
                gap: isMobile ? "1.5rem" : "2rem"
              }}>
                {watchlistListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "2rem",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid rgba(249, 245, 237, 0.6)",
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
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem"
                        }}>
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWatchlist(listing.id, 'listing')}
                            style={{
                              background: "#8B7355",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                              flexShrink: 0
                            }}
                          >
                            ×
                          </motion.button>
                        </div>
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
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onMessage({ id: listing.helperId, name: listing.helper })}
                              style={{
                                background: "#8B7355",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif"
                              }}
                            >
                              Message
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onReport({ id: listing.helperId, name: listing.helper, username: listing.helper.toLowerCase().replace(' ', '_') })}
                              style={{
                                background: "transparent",
                                color: "#666",
                                border: "1px solid #E8DCC0",
                                borderRadius: "12px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif"
                              }}
                            >
                              Report
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Events */}
          {watchlistEvents.length > 0 && (
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  color: "#231a13",
                  marginBottom: "2rem",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em"
                }}
              >
                Saved Events ({watchlistEvents.length})
              </motion.h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
                gap: isMobile ? "1.5rem" : "2rem"
              }}>
                {watchlistEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "2rem",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid rgba(249, 245, 237, 0.6)",
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
                        📅
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem"
                        }}>
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWatchlist(event.id, 'event')}
                            style={{
                              background: "#8B7355",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                              flexShrink: 0
                            }}
                          >
                            ×
                          </motion.button>
                        </div>
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
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onMessage({ id: event.curatorId, name: event.curator })}
                              style={{
                                background: "#8B7355",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif"
                              }}
                            >
                              Message
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onReport({ id: event.curatorId, name: event.curator, username: event.curator.toLowerCase().replace(' ', '_') })}
                              style={{
                                background: "transparent",
                                color: "#666",
                                border: "1px solid #E8DCC0",
                                borderRadius: "12px",
                                padding: "0.4rem 0.8rem",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif"
                              }}
                            >
                              Report
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reporting Modal Component
const ReportingModal = ({ isOpen, onClose, targetUser, currentUser }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  if (!targetUser || !currentUser) return null;

  const reportReasons = [
    "Inappropriate content",
    "Harassment or bullying",
    "Spam or misleading information",
    "Violation of community guidelines",
    "Fraudulent activity",
    "Other"
  ];

  const submitReport = () => {
    if (reason && description.trim()) {
      const report = {
        id: Date.now(),
        reporterId: currentUser.id,
        reportedUserId: targetUser.id,
        reason,
        description: description.trim(),
        timestamp: new Date().toISOString(),
        status: "pending"
      };

      // Save report to localStorage (in a real app, this would go to a server)
      const existingReports = JSON.parse(localStorage.getItem('user_reports') || '[]');
      existingReports.push(report);
      localStorage.setItem('user_reports', JSON.stringify(existingReports));

      alert("Report submitted successfully. Our team will review it shortly.");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          padding: "2rem"
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>Report User</h2>
        <p style={{ margin: "0 0 1.5rem 0", color: "#666", fontSize: "0.9rem" }}>
          Reporting: {targetUser.name || targetUser.username}
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
            Reason for report *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none"
            }}
          >
            <option value="">Select a reason</option>
            {reportReasons.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#231a13" }}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about the issue..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              color: "#666",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Cancel
          </button>
          <button
            onClick={submitReport}
            disabled={!reason || !description.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: (!reason || !description.trim()) ? "#ccc" : "#8B7355",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (!reason || !description.trim()) ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            Submit Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Main App Component
function App() {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('paros_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem('paros_page');
    return savedPage || "browse";
  });

  // Messaging and reporting state
  const [messagingModal, setMessagingModal] = useState({ isOpen: false, recipient: null });
  const [reportingModal, setReportingModal] = useState({ isOpen: false, targetUser: null });
  const [createListingModal, setCreateListingModal] = useState({ isOpen: false });
  const [createEventModal, setCreateEventModal] = useState({ isOpen: false });

  const isDarkMode = false;

  // Save user and page state to localStorage whenever they change
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('paros_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('paros_user');
    }
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('paros_page', page);
  }, [page]);

  function onLoginSuccess(userData) {
    // Set logged-in user as user 0 (demo)
    setUser({
      id: 0,
      username: "demo",
      preferredName: "Demo User",
      country: "Netherlands",
      province: "North Holland",
      city: "Amsterdam",
      pinCode: "1000",
      aboutMe: "Demo user for testing the Paros community platform.",
      skills: ["Testing", "Demo"],
      customSkills: [],
      lendingItems: ["Demo Items"],
      customLending: [],
      barterPreferences: "Open to demo exchanges.",
      profileImages: [null, null, null, null, null, null],
      trustScore: 5.0,
      joinDate: new Date().toISOString().split('T')[0]
    });
    setPage("profile");
  }

  function handleLogout() {
    setUser(null);
    setPage("dashboard");
    // Clear localStorage on logout
    localStorage.removeItem('paros_user');
    localStorage.removeItem('paros_page');
  }

  const navigateTo = (pageName) => setPage(pageName);

  const openMessaging = (recipient) => {
    setMessagingModal({ isOpen: true, recipient });
  };

  const closeMessaging = () => {
    setMessagingModal({ isOpen: false, recipient: null });
  };

  const openReporting = (targetUser) => {
    setReportingModal({ isOpen: true, targetUser });
  };

  const closeReporting = () => {
    setReportingModal({ isOpen: false, targetUser: null });
  };

  const openCreateListing = () => {
    setCreateListingModal({ isOpen: true });
  };

  const closeCreateListing = () => {
    setCreateListingModal({ isOpen: false });
  };

  const openCreateEvent = () => {
    setCreateEventModal({ isOpen: true });
  };

  const closeCreateEvent = () => {
    setCreateEventModal({ isOpen: false });
  };

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
          <Dashboard
            user={user}
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
            listings={dummyListings}
            events={dummyEvents}
            onMessage={openMessaging}
            onReport={openReporting}
            users={dummyUsers}
          />
        )}
        {page === "messages" && (
          <MessagesPage
            currentUser={user}
            users={dummyUsers}
            onMessage={openMessaging}
          />
        )}
        {page === "profile" && <UserProfile user={user} setUser={setUser} isDarkMode={isDarkMode} />}
        {page === "browse" && <SwipeableListings listings={dummyListings} isDarkMode={isDarkMode} onCreateListing={openCreateListing} user={user} onMessage={openMessaging} onReport={openReporting} users={dummyUsers} />}
        {page === "events" && <Events events={dummyEvents} isDarkMode={isDarkMode} onCreateEvent={openCreateEvent} />}
        {page === "watchlist" && <Watchlist user={user} isDarkMode={isDarkMode} onMessage={openMessaging} onReport={openReporting} users={dummyUsers} />}
        {page === "create" && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Create New Masterpiece Coming Soon</h2>
            <p>This feature will allow you to create new listings and events.</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Messaging Modal */}
      <MessagingModal
        isOpen={messagingModal.isOpen}
        onClose={closeMessaging}
        recipient={messagingModal.recipient}
        currentUser={user}
        users={dummyUsers}
      />

      {/* Reporting Modal */}
      <ReportingModal
        isOpen={reportingModal.isOpen}
        onClose={closeReporting}
        targetUser={reportingModal.targetUser}
        currentUser={user}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={createListingModal.isOpen}
        onClose={closeCreateListing}
        currentUser={user}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createEventModal.isOpen}
        onClose={closeCreateEvent}
        currentUser={user}
      />
    </>
  );
}

export default App;
