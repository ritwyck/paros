import React, { useState } from "react";
import { motion } from "framer-motion";

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

export default CleanNavigation;
