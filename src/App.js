import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

import "./index.css"; // Your global CSS with new palette and fonts

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

// **[GALLERY ARTISTIC UI SYSTEM]** Complete Suite
const dummyListings = [
  {
    id: 1,
    title: "Garden Help",
    category: "service",
    description: "Help with gardening tasks in exchange for fresh produce from garden!",
    location: "Local area A",
    curator: "Maria G.",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    title: "Guitar Lessons",
    category: "skill",
    description: "Private acoustic and classical guitar lessons for beginners and intermediates.",
    location: "Local area B",
    curator: "Alex R.",
    lastActive: "5 hours ago"
  },
  {
    id: 3,
    title: "Lawn Mower",
    category: "good",
    description: "Well-maintained electric lawn mower available to borrow Saturdays only.",
    location: "Local area A",
    curator: "David K.",
    lastActive: "1 day ago"
  },
  {
    id: 4,
    title: "Spanish Conversation",
    category: "skill",
    description: "Practice Spanish conversation skills with a native speaker over coffee.",
    location: "Downtown",
    curator: "Sara M.",
    lastActive: "3 hours ago"
  }
];

const dummyEvents = [
  {
    id: 1,
    title: "Community Gardening Day",
    date: "2025-11-05",
    time: "09:00 - 17:00",
    location: "Riverside Park, pavilion area",
    description: "Join our community garden transformation! Bring gardening tools, gloves, and water bottles. We'll be planting fall vegetables and wildflowers. Ran Hiroshi leads this collaborative artwork.",
    curator: "Community Council",
    attendees: ["Maria G.", "Carlos L.", "Sophie W.", "+12 more"],
    category: "gardening",
    curator: "Ran H.",
    lastActive: "Featured"
  },
  {
    id: 2,
    title: "Open Mic Night",
    date: "2025-11-12",
    time: "20:00 - 22:00",
    location: "The Coffee House, downtown",
    description: "Monthly showcase of local musical and spoken word creations. Featured ‘poetry without fear’ session hosted by acclaimed poet Lena Vasquez. Perfect for your hidden talents.",
    curator: "Lena V.",
    attendees: ["Jasmine T.", "Miguel R.", "Tomi O.", "+8 more"],
    category: "music",
    category: "performance"
  },
  {
    id: 3,
    title: "Tool Library Workshop",
    date: "2025-11-18",
    time: "14:00 - 16:00",
    location: "Maker Space, Industrial Park",
    description: "Introduction to our neighborhood tool library. Learn about woodworking fundamentals with hand and power tools. Perfect for your DIY masterpieces.",
    curator: "The Maker Collective",
    attendees: ["David K.", "Rachel N.", "Carlos L.", "+5 more"],
    category: "workshop",
    lastActive: "New"
  }
];

// **[GALLERY ARTIST DESIGN SYSTEM]**
const GlobalMapBackground = ({ isDarkMode }) => {
  const mapRef = React.useRef();
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (mapRef.current) {
        const startLat = 18.58;
        const endLat = 18.45;
        const lat = startLat + (endLat - startLat) * progress;
        const lng = 73.8567;
        try {
          mapRef.current.setView([lat, lng], 14, { animate: true, duration: 0.5 });
        } catch (error) {
          // Silent fail
        }
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

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
          center={[18.58, 73.8567]}
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

const ThemeToggleButton = ({ isDarkMode, onToggle }) => (
  <motion.button
    whileHover={{
      backgroundColor: isDarkMode ? "#231a13" : "#E8DCC0",
      color: isDarkMode ? "#E8DCC0" : "#231a13",
      border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    style={{
      position: "fixed",
      top: 20,
      left: 20,
      backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
      color: isDarkMode ? "#231a13" : "#E8DCC0",
      border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
      borderRadius: 0,
      padding: "0.6rem 1rem",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: `0 4px 16px ${isDarkMode ? "rgba(232, 220, 192, 0.3)" : "rgba(35, 26, 19, 0.3)"}`,
      zIndex: 1000,
      fontFamily: "'Inter', sans-serif",
      transition: "all 0.3s ease",
    }}
  >
    {isDarkMode ? "Light" : "Dark"}
  </motion.button>
);

// **[ART GALLERY DASHBOARD]**
const Dashboard = ({ user, isDarkMode, onNavigate, listings, events }) => (
  <div style={{ position: "relative", zIndex: 10, padding: "4rem 1rem 6rem" }}>
    {/* Profile Overview */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        maxWidth: 1000,
        margin: "0 auto 4rem",
        background: isDarkMode ? "rgba(35, 26, 19, 0.95)" : "rgba(251, 248, 241, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 0,
        padding: "3rem",
        border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
      }}
    >
      <h1 style={{
        fontSize: "3rem",
        fontWeight: 400,
        textAlign: "center",
        marginBottom: "0.5rem",
        color: isDarkMode ? "#E8DCC0" : "#231a13",
        textTransform: "uppercase",
        letterSpacing: "0.1em"
      }}>
        Welcome Back, {user.username || "Neighbor"}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
        {/* Quick Profile Stats */}
        <div style={{
          background: isDarkMode ? "rgba(62, 39, 35, 0.9)" : "rgba(251, 248, 241, 0.9)",
          padding: "2rem",
          borderRadius: 0,
          border: `1px solid ${isDarkMode ? "rgba(152, 109, 106, 0.3)" : "rgba(249, 245, 237, 0.5)"}`,
        }}>
          <h3 style={{ color: isDarkMode ? "#F5F1E7" : "#231a13", marginBottom: "1rem", fontSize: "1.5rem" }}>
            Your Community Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: isDarkMode ? "#F5F1E7" : "#231a13" }}>
              <span>Active Listings</span>
              <strong>{listings.filter(l => l.curator === user.username || l.curator?.split('.')[0] === user.username?.charAt(0)).length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: isDarkMode ? "#F5F1E7" : "#231a13" }}>
              <span>Upcoming Events</span>
              <strong>{events.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: isDarkMode ? "#F5F1E7" : "#231a13" }}>
              <span>Community Impact</span>
              <strong>"Rising Artist"</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: isDarkMode ? "rgba(62, 39, 35, 0.9)" : "rgba(251, 248, 241, 0.9)",
          padding: "2rem",
          borderRadius: 0,
          border: `1px solid ${isDarkMode ? "rgba(152, 109, 106, 0.3)" : "rgba(249, 245, 237, 0.5)"}`,
        }}>
          <h3 style={{ color: isDarkMode ? "#F5F1E7" : "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
Neighborhood Tools
          </h3>
          <div style={{ display: "grid", gap: "0.8rem" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate("profile")}
              style={{
                backgroundColor: isDarkMode ? "#004d40" : "#E8DCC0",
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                border: "none",
                borderRadius: 0,
                padding: "0.9rem 1.5rem",
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate("create")}
              style={{
                backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
                color: isDarkMode ? "#231a13" : "#E8DCC0",
                border: `1px solid ${isDarkMode ? "#231a13" : "#E8DCC0"}`,
                borderRadius: 0,
                padding: "0.9rem 1.5rem",
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
Create New Post
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Recent Activity */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
        gap: "2rem",
      }}
    >
      {/* Trending Listings */}
      <div style={{
        background: isDarkMode ? "rgba(35, 26, 19, 0.95)" : "rgba(251, 248, 241, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 0,
        padding: "2rem",
        border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
      }}>
        <h2 style={{
          color: isDarkMode ? "#F5F1E7" : "#231a13",
          marginBottom: "2rem",
          fontSize: "1.8rem",
          fontWeight: 600,
          letterSpacing: "0.05em"
        }}>
        Local Highlights
        </h2>
        {listings.slice(0, 3).map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={{
              background: isDarkMode ? "rgba(62, 39, 35, 0.9)" : "rgba(251, 248, 241, 0.9)",
              padding: "1.5rem",
              marginBottom: "1rem",
              borderRadius: 0,
              border: `1px solid ${isDarkMode ? "rgba(152, 109, 106, 0.3)" : "rgba(249, 245, 237, 0.5)"}`,
              cursor: "pointer"
            }}
          >
            <h4 style={{
              margin: 0,
              color: isDarkMode ? "#F5F1E7" : "#231a13",
              fontSize: "1.2rem",
              fontWeight: 600
            }}>
              {listing.title}
            </h4>
            <p style={{
              margin: "0.5rem 0",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              fontSize: "0.9rem",
              lineHeight: 1.4
            }}>
              {listing.description.substring(0, 100)}...
            </p>
            <small style={{
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              opacity: 0.7
            }}>
              Curated by {listing.curator} • {listing.lastActive}
            </small>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div style={{
        background: isDarkMode ? "rgba(35, 26, 19, 0.95)" : "rgba(251, 248, 241, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 0,
        padding: "2rem",
        border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
      }}>
        <h2 style={{
          color: isDarkMode ? "#F5F1E7" : "#231a13",
          marginBottom: "2rem",
          fontSize: "1.8rem",
          fontWeight: 600,
          letterSpacing: "0.05em"
        }}>
          🎨 Community Performances
        </h2>
        {events.slice(0, 3).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={{
              background: isDarkMode ? "rgba(62, 39, 35, 0.9)" : "rgba(251, 248, 241, 0.9)",
              padding: "1.5rem",
              marginBottom: "1rem",
              borderRadius: 0,
              border: `1px solid ${isDarkMode ? "rgba(152, 109, 106, 0.3)" : "rgba(249, 245, 237, 0.5)"}`,
              cursor: "pointer"
            }}
          >
            <h4 style={{
              margin: 0,
              color: isDarkMode ? "#F5F1E7" : "#231a13",
              fontSize: "1.2rem",
              fontWeight: 600
            }}>
              {event.title}
            </h4>
            <p style={{
              margin: "0.5rem 0",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              fontSize: "0.9rem",
              lineHeight: 1.4
            }}>
              {event.date} • {event.time}
            </p>
            <small style={{
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              opacity: 0.7
            }}>
              Curated by {event.curator} • {event.lastActive}
            </small>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

// **[ART GALLERY ACCESSIBLE NAVIGATION]**
const ArtisticNavigation = ({ currentPage, onNavigate, onLogout, isDarkMode }) => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 900,
      background: isDarkMode ? "rgba(35, 26, 19, 0.95)" : "rgba(251, 248, 241, 0.95)",
      backdropFilter: "blur(30px)",
      borderBottom: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
      padding: "1.5rem 2rem",
    }}
  >
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <h1 style={{
        fontSize: "2rem",
        fontWeight: 600,
        color: isDarkMode ? "#E8DCC0" : "#231a13",
        cursor: "pointer",
        margin: 0,
        letterSpacing: "0.05em",
        textTransform: "uppercase"
      }}>
        Paros
      </h1>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {[
          { key: "dashboard", label: "Neighborhood Hub", icon: ">" },
          { key: "browse", label: "Community Exchange", icon: ">" },
          { key: "events", label: "Local Gatherings", icon: ">" },
          { key: "profile", label: "My Profile", icon: ">" },
        ].map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(item.key)}
            style={{
              background: "none",
              border: currentPage === item.key ? `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}` : "2px solid transparent",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              padding: "0.8rem 1.5rem",
              borderRadius: 0,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: currentPage === item.key ? 700 : 500,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease",
              boxShadow: currentPage === item.key ?
                (isDarkMode ? "0 0 20px rgba(232, 220, 192, 0.4)" : "0 0 20px rgba(35, 26, 19, 0.3)") :
                "none"
            }}
          >
            {currentPage === item.key ? item.label : item.icon}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          style={{
            backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
            color: isDarkMode ? "#231a13" : "#E8DCC0",
            border: "none",
            borderRadius: 0,
            padding: "0.8rem 1.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          🎯 Sign Out
        </motion.button>
      </div>
    </div>
  </motion.nav>
);

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  // Theme integration
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('paros-theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('paros-theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  function onLoginSuccess(userData) {
    setUser(userData);
    setPage("dashboard"); // 🎯 Start at dashboard for profile emphasis
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
      <GlobalMapBackground isDarkMode={isDarkMode} />
      <ThemeToggleButton isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <ArtisticNavigation
        currentPage={page}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      <div style={{ overflowX: "hidden", marginTop: "120px" }}>
        {page === "dashboard" && (
          <Dashboard user={user} isDarkMode={isDarkMode} onNavigate={navigateTo} listings={dummyListings} events={dummyEvents} />
        )}
        {page === "profile" && <UserProfile user={user} setUser={setUser} />}
        {page === "browse" && <Listings listings={dummyListings} isDarkMode={isDarkMode} />}
        {page === "events" && <Events events={dummyEvents} isDarkMode={isDarkMode} />}
        {page === "create" && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Create New Masterpiece Coming Soon</h2>
            <p>This feature will allow you to create new listings and events.</p>
          </div>
        )}
      </div>

      {/* Art Gallery Footer */}
      <footer style={{
        position: "relative",
        backgroundColor: "#000000",
        color: "#F5F1E7",
        padding: "3rem 1rem 2rem",
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
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}>
          <div>
            <h3 style={{ color: "#F5F1E7", marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 700 }}>
              🖼️ Paros Community
            </h3>
            <p style={{ color: "#F5F1E7", opacity: 0.9, lineHeight: 1.6 }}>
              Building beautiful connections through shared creativity and community spirit.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#F5F1E7", marginBottom: "1rem", fontWeight: 600, fontSize: "1.2rem" }}>
              🎭 Creative Spaces
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Local Art Exchanges</li>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Creative Workspaces</li>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Community Performances</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#F5F1E7", marginBottom: "1rem", fontWeight: 600, fontSize: "1.2rem" }}>
              🌟 Connect & Create
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Curatorial Communities</li>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Art Collective Events</li>
              <li style={{ color: "#F5F1E7", marginBottom: "0.5rem", opacity: 0.9 }}>Creative Collaborations</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#F5F1E7", marginBottom: "1rem", fontWeight: 600, fontSize: "1.2rem" }}>
              🎨 Artistic Soul
            </h4>
            <p style={{ color: "#F5F1E7", opacity: 0.9, fontSize: "0.9rem", lineHeight: 1.5 }}>
              "Every connection is a masterpiece waiting to be created"
            </p>
          </div>
        </div>

        <div style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(245, 241, 231, 0.3)",
          paddingTop: "2rem",
        }}>
          <p style={{ color: "#F5F1E7", opacity: 0.8 }}>
            © 2025 Paros. Curating community, one masterpiece at a time. 🖼️🎨
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
