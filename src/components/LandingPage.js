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

const ScrollIndicator = () => {
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
          borderTop: "1.5rem solid #F5F1E7",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
        }}
      />
    </motion.div>
  );
};

const GlobalMapBackground = () => {
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
          {/* Transport-focused dark map */}
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://cartodb.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          />
        </MapContainer>
      </div>

      {/* Black 25% transparency layer (z-index: 1) */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        pointerEvents: "none"
      }} />
    </>
  );
};

const FloatingLoginButton = ({ onLoginSuccess, style }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Mock user storage (would use localStorage in real implementation)
  const mockUsers = [
    { username: "demo", email: "demo@paros.com", password: "demo123", profilePic: null }
  ];

  const handleSubmit = (formData) => {
    if (isLogin) {
      // Mock login logic
      const user = mockUsers.find(u =>
        u.username === formData.username && u.password === formData.password
      );
      if (user) {
        setShowAuth(false);
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
      setShowAuth(false);
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAuth(true)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: "#004d40",
          color: "#F5F1E7",
          border: "none",
          borderRadius: 8,
          padding: "0.8rem 1.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0, 77, 64, 0.3)",
          zIndex: 1000,
          fontFamily: "'Inter', sans-serif",
          ...style,
        }}
      >
        Login or Signup
      </motion.button>

      {showAuth && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(35, 26, 19, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,


          }}
          onClick={() => setShowAuth(false)}
        >
          <div
            style={{
              backgroundColor: "#F7F6F3",
              borderRadius: 16,
              padding: "2rem",
              maxWidth: 450,
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuth(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#231a13",
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: "2rem" }}>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: isLogin ? "#004d40" : "transparent",
                  color: isLogin ? "#F5F1E7" : "#231a13",
                  border: `2px solid ${isLogin ? "#004d40" : "#231a13"}`,
                  borderRadius: "8px 0 0 8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  background: !isLogin ? "#004d40" : "transparent",
                  color: !isLogin ? "#F5F1E7" : "#231a13",
                  border: `2px solid ${!isLogin ? "#004d40" : "#231a13"}`,
                  borderRadius: "0 8px 8px 0",
                  borderLeft: "none",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Signup
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                username: formData.get('username'),
                password: formData.get('password'),
                email: isLogin ? '' : formData.get('email'),
                profilePic: isLogin ? null : null,
              };
              handleSubmit(data);
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter username"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #004d40",
                    borderRadius: 8,
                    fontSize: "1rem",
                  }}
                />
              </div>

              {!isLogin && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter email"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #004d40",
                      borderRadius: 8,
                      fontSize: "1rem",
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter password"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #004d40",
                    borderRadius: 8,
                    fontSize: "1rem",
                  }}
                />
                {isLogin && (
                  <small style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.5rem", display: "block" }}>
                    For demo: use username "demo" and password "demo123"
                  </small>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#004d40",
                  color: "#F5F1E7",
                  border: "none",
                  borderRadius: 8,
                  padding: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default function LandingPage({ onLoginSuccess }) {
  return (
    <>
      <GlobalMapBackground />
      <FloatingLoginButton onLoginSuccess={onLoginSuccess} />
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
          </motion.div>

          <ScrollIndicator />
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
              background: "rgba(247, 246, 243, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
              padding: "3rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: "1px solid rgba(245, 241, 231, 0.3)",
            }}
          >
            <h2
              style={{
                fontSize: "3.5rem",
                fontWeight: 800,
                marginBottom: "2rem",
                letterSpacing: "0.1em",
                color: "#004d40",
              }}
            >
              About Paros
            </h2>
            <p
              style={{
                fontSize: "1.4rem",
                lineHeight: 1.6,
                marginBottom: "2rem",
                color: "#231a13",
                opacity: 0.9,
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
              color: "#F5F1E7",
              marginBottom: "4rem",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.1em",
              textShadow: "0 4px 8px rgba(0,0,0,0.6)",
            }}
          >
            What Makes Paros Special
          </motion.h2>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2rem",
              maxWidth: 1000,
              width: "100%",
              padding: "0 2rem",
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
                  background: "rgba(245, 241, 231, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(245, 241, 231, 0.3)",
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
                    color: "#004d40",
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
                    color: "#231a13",
                    opacity: 0.9,
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
            padding: "4rem 1rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: 600,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
              padding: "3rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.1)",
              fontFamily: "'Inter', sans-serif",
              zIndex: 10, // Ensure it's above the black overlay
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#004d40",
                marginBottom: "2rem",
                letterSpacing: "0.1em",
              }}
            >
              Join Your Community Today
            </h2>
            <p
              style={{
                fontSize: "1.3rem",
                color: "#231a13",
                marginBottom: "3rem",
                lineHeight: 1.6,
              }}
            >
              Ready to connect, share, and grow with your neighbors? Create your profile and start building relationships that matter.
            </p>
            <button
              onClick={() => onLoginSuccess({ username: "guest" })}
              style={{
                backgroundColor: "#004d40",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 16,
                padding: "1.2rem 3rem",
                fontSize: "1.2rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get Started
            </button>
          </motion.div>
        </section>

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
