import React, { useState } from "react";

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

export default Footer;
