import React, { useState } from "react";
import { motion } from "framer-motion";

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
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);
};

export default Dashboard;
