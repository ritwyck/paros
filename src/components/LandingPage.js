import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import LoginSignup from "./LoginSignup";

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

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 3,
    },
  },
};

const ScrollIndicator = ({ isDarkMode }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={scrollIndicatorVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        cursor: "pointer",
        zIndex: 15,
      }}
      onClick={() => scrollToSection("about-section")}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 0,
          height: 0,
          borderLeft: "1rem solid transparent",
          borderRight: "1rem solid transparent",
          borderTop: `1.5rem solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
        }}
      />
    </motion.div>
  );
};



const GlobalMapBackground = ({ isDarkMode }) => {
  const mapRef = React.useRef();
  const { scrollYProgress } = useScroll();

  // Navigate map southward as user scrolls vertically (down the map with text)
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (mapRef.current) {
        // Calculate latitude southward as user scrolls down the text
        const startLat = 18.58;  // Start higher on map
        const endLat = 18.45;    // End lower on map
        const lat = startLat + (endLat - startLat) * progress;

        const lng = 73.8567; // Keep longitude constant (straight south)

        try {
          mapRef.current.setView([lat, lng], 14, { animate: true, duration: 0.5 });
        } catch (error) {
          // Silent fail if map operations fail
        }
      }
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <>
      {/* Scrolling Map Layer (z-index: 0) */}
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
          center={[18.58, 73.8567]} // Start position
          zoom={14} // Consistent zoom level throughout
          scrollWheelZoom={false}
          style={{
            height: "100vh",
            width: "100vw"
          }}
          attributionControl={false}
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
          keyboard={false}
          boxZoom={false}
          tap={false}
          touchZoom={false}
        >
          {/* Conditionally render map tiles based on theme */}
          <TileLayer
            url={
              isDarkMode
                ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              isDarkMode
                ? '&copy; <a href="https://cartodb.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            }
          />
        </MapContainer>
      </div>

      {/* Conditional overlay based on theme (z-index: 1) */}
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

const FloatingLoginButton = ({ onModalOpen, isDarkMode, style }) => {
  return (
    <motion.button
      whileHover={{
        backgroundColor: isDarkMode ? "#000000" : "#E8DCC0",
        color: isDarkMode ? "#E8DCC0" : "#231a13",
        border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
        BoxShadow: `0 4px 16px ${isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(232,220,192,0.4)"}`,
        transition: { duration: 0.3 }
      }}
      onClick={onModalOpen}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
        color: isDarkMode ? "#231a13" : "#E8DCC0",
        border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
        borderRadius: 0, // Sharp corners
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: `0 4px 16px ${isDarkMode ? "rgba(232, 220, 192, 0.3)" : "rgba(0, 0, 0, 0.3)"}`,
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      Login / Signup
    </motion.button>
  );
};

const JoinSection = ({ isDarkMode, onOpenModal, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      style={{
        maxWidth: 600,
        textAlign: "center",
        background: isDarkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(251, 248, 241, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        padding: isMobile ? "2rem" : "3rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        border: "1px solid rgba(249, 245, 237, 0.3)",
        fontFamily: "'Inter', sans-serif",
        zIndex: 10, // Ensure it's above the black overlay
        position: "relative",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "1.8rem" : "2.5rem",
          fontWeight: 800,
          color: isDarkMode ? "#E8DCC0" : "#231a13",
          marginBottom: "2rem",
          letterSpacing: "0.1em",
        }}
      >
        Join Your Community Today
      </h2>
      <p
        style={{
          fontSize: isMobile ? "1rem" : "1.3rem",
          color: isDarkMode ? "#E8DCC0" : "#231a13",
          marginBottom: "3rem",
          lineHeight: 1.6,
        }}
      >
        Ready to connect, share, and grow with your neighbors? Create your profile and start building relationships that matter.
      </p>
      <motion.button
        onClick={onOpenModal} // Opens the same modal
        whileHover={{
          backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
          color: isDarkMode ? "#231a13" : "#E8DCC0",
          boxShadow: "0 4px 16px rgba(0,77,64,0.4)",
          transition: { duration: 0.3 }
        }}
        style={{
          backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
          color: isDarkMode ? "#231a13" : "#E8DCC0",
          border: "none",
          borderRadius: 0, // Sharp corners
          padding: isMobile ? "1rem 2rem" : "1.2rem 3rem",
          fontSize: isMobile ? "1rem" : "1.2rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(251,248,241,0.2)",
          transition: "all 0.3s ease",
        }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
};

export default function LandingPage({ onLoginSuccess }) {
  // Light mode only
  const isDarkMode = false;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock user storage (would use localStorage in real implementation)
  const mockUsers = [
    { username: "demo", email: "demo@paros.com", password: "demo123", profilePic: null }
  ];

  const openModal = () => setShowAuthModal(true);

  const handleSubmit = (formData) => {
    if (isLogin) {
      // Mock login logic
      const user = mockUsers.find(u =>
        u.username === formData.username && u.password === formData.password
      );
      if (user) {
        setShowAuthModal(false);
        onLoginSuccess({
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          isLoggedIn: true
        });
      } else {
        alert("Invalid credentials. Use demo/demo123 to test login.");
      }
    } else {
      // Mock signup - just accept the signup data
      setShowAuthModal(false);
      onLoginSuccess({
        username: formData.username,
        email: formData.email,
        profilePic: formData.profilePic,
        isLoggedIn: true
      });
    }
  };

  return (
    <>
      <GlobalMapBackground isDarkMode={isDarkMode} />
      <FloatingLoginButton onModalOpen={openModal} isDarkMode={isDarkMode} />
      <div style={{ overflowX: "hidden" }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",







          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ position: "relative", zIndex: 10, maxWidth: 720, padding: "0 1rem" }}
          >
            <motion.h1
              variants={itemVariants}
              whileHover={{
                color: isDarkMode ? "rgba(0,150,136,0.8)" : "rgba(0,77,64,0.8)",
                transition: { duration: 0.3 }
              }}
              style={{
                fontSize: isMobile ? "3rem" : "6rem",
                fontWeight: 900,
                letterSpacing: isMobile ? "0.1em" : "0.2em",
                margin: 0,
                userSelect: "none",
                fontFamily: "'Inter', sans-serif",
                textTransform: "uppercase",
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                textShadow: isDarkMode ? "0 0 20px rgba(0,0,0,0.8), 0 6px 12px rgba(0,0,0,0.5)" : "0 4px 8px rgba(255,255,255,0.6)",
                cursor: "pointer",
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
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                textShadow: isDarkMode ? "0 0 10px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3)" : "0 2px 4px rgba(255,255,255,0.5)",
              }}
            >
              Connect. Grow. Thrive.
            </motion.p>
          </motion.div>

          <ScrollIndicator isDarkMode={isDarkMode} />
        </section>

        {/* About Section */}
        <section
          id="about-section"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: 800,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              background: isDarkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(251, 248, 241, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
              padding: isMobile ? "2rem" : "3rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.3)" : "rgba(249, 245, 237, 0.3)"}`,
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "2.5rem" : "3.5rem",
                fontWeight: 800,
                marginBottom: "2rem",
                letterSpacing: "0.1em",
                color: isDarkMode ? "#E8DCC0" : "#231a13",
              }}
            >
              About Paros
            </h2>
            <p
              style={{
                fontSize: isMobile ? "1.1rem" : "1.4rem",
                lineHeight: 1.6,
                marginBottom: "2rem",
                color: isDarkMode ? "#E8DCC0" : "#231a13",
              }}
            >
              Paros is more than an app – it's a movement to bridge communities through meaningful connections.
              We believe that every neighborhood holds untapped potential for collaboration, growth, and mutual support.
              Join a platform where locals share skills, offer services, exchange goods, and build lasting relationships.
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1rem",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 10,
              fontSize: "3rem",
              fontWeight: 800,
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              marginBottom: "4rem",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.1em",
              textShadow: isDarkMode ? "0 4px 8px rgba(0,0,0,0.6)" : "0 2px 8px rgba(255,255,255,0.6)",
            }}
          >
            What Makes Paros Special
          </motion.h2>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: isMobile ? "1.5rem" : "2rem",
              maxWidth: 1000,
              width: "100%",
              padding: isMobile ? "0 1rem" : "0 2rem",
            }}
          >
            {[
              {
                title: "Local Connections",
                description: "Discover neighbors with skills and services you need, right in your community.",
              },
              {
                title: "Mutual Exchange",
                description: "Share what you have, get what you need – create sustainable local economies.",
              },
              {
                title: "Community Events",
                description: "Participate in local gatherings, workshops, and collaborative activities that bring people together.",
              },
              {
                title: "Growth Together",
                description: "Build relationships, learn new skills, and contribute to a thriving community ecosystem.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                  background: isDarkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(251, 248, 241, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${isDarkMode ? "rgba(249, 245, 237, 0.3)" : "rgba(249, 245, 237, 0.3)"}`,
                  borderRadius: 16,
                  padding: "2rem",
                  textAlign: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: isDarkMode ? "#F5F1E7" : "#231a13",
                    marginBottom: "1rem",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    color: isDarkMode ? "#E8DCC0" : "#231a13",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join Section */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "6rem 1rem" : "4rem 1rem",
          }}
        >
          <JoinSection isDarkMode={isDarkMode} onOpenModal={openModal} isMobile={isMobile} />
        </section>

        {/* Auth Modal Overlay */}
        {showAuthModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
            onClick={() => setShowAuthModal(false)}
          >
            <LoginSignup onLogin={handleSubmit} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Footer - Solid black end with proper height */}
        <footer
          style={{
            position: "relative",
            backgroundColor: "#000000",
            color: "#F5F1E7",
            padding: "3rem 1rem 2rem",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            zIndex: 10, // Above everything
            // THIS IS THE END - NO MORE SCROLLING
          }}
        >
          {/* Solid black overlay covering entire footer area */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#000000",
              zIndex: -1,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#F5F1E7",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Paros
              </h3>
              <p style={{
                color: "#F5F1E7",
                opacity: 0.9
              }}>
                Bringing communities closer through meaningful connections.
              </p>
            </div>

            <div>
              <h4 style={{
                color: "#F5F1E7",
                marginBottom: "1rem",
                fontWeight: 600,
                fontSize: "1.2rem"
              }}>Community</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Local Services</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Skill Sharing</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Events</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Goods Exchange</li>
              </ul>
            </div>

            <div>
              <h4 style={{
                color: "#F5F1E7",
                marginBottom: "1rem",
                fontWeight: 600,
                fontSize: "1.2rem"
              }}>Connect</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Join Community</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Find Neighbors</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Share Skills</li>
                <li style={{
                  color: "#F5F1E7",
                  marginBottom: "0.5rem",
                  opacity: 0.9
                }}>Organize Events</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid rgba(245, 241, 231, 0.3)",
              paddingTop: "2rem",
            }}
          >
            <p style={{
              color: "#F5F1E7",
              opacity: 0.8
            }}>© 2025 Paros. Building stronger communities together.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
