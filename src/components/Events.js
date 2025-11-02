import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

const Events = ({ events, isDarkMode, onCreateEvent }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    location: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter (title and description)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                             event.description.toLowerCase().includes(searchTerm) ||
                             event.curator.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Date filter
      if (filters.date) {
        if (event.date !== filters.date) return false;
      }

      // Category filter
      if (filters.category) {
        if (event.category !== filters.category) return false;
      }

      // Location filter
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        if (!event.location.toLowerCase().includes(locationTerm)) return false;
      }

      return true;
    });
  }, [events, filters]);

  // Get unique categories and locations for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(events.map(event => event.category))];
    return uniqueCategories.sort();
  }, [events]);

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(events.map(event => event.location))];
    return uniqueLocations.sort();
  }, [events]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      category: '',
      location: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
          Community Events
        </h1>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          color: "#666",
          margin: "0 0 1rem 0",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif"
        }}>
          Join local gatherings, workshops, and collaborative activities that bring our community together
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateEvent}
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
            boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)"
          }}
        >
          + Create New Event
        </motion.button>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          maxWidth: "1400px",
          margin: "0 auto 3rem",
          background: "white",
          borderRadius: isMobile ? "16px" : "20px",
          padding: isMobile ? "2rem 1.5rem" : "3rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid rgba(249, 245, 237, 0.6)"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            fontSize: isMobile ? "1.4rem" : "1.6rem",
            fontWeight: 600,
            color: "#231a13",
            margin: 0,
            fontFamily: "'Inter', sans-serif"
          }}>
            Filter Events
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                style={{
                  background: "transparent",
                  color: "#666",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Clear Filters
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: hasActiveFilters ? "#8B7355" : "transparent",
                color: hasActiveFilters ? "white" : "#666",
                border: hasActiveFilters ? "none" : "2px solid #E8DCC0",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >

              {isMobile ? "Filters" : "Show Filters"}
              {hasActiveFilters && (
                <span style={{
                  background: hasActiveFilters ? "rgba(255,255,255,0.3)" : "#8B7355",
                  color: hasActiveFilters ? "white" : "#231a13",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "bold"
                }}>
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              overflow: "hidden"
            }}
          >
            {/* Search Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#231a13",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Search Events
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search by title, description, or organizer..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>

            {/* Date Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#231a13",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Event Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => updateFilter('date', e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#231a13",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
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
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#231a13",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif"
              }}>
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
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
          </motion.div>
        )}

        {/* Results Summary */}
        <div style={{
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(232,220,192,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{
            color: "#666",
            fontSize: "0.9rem",
            fontFamily: "'Inter', sans-serif"
          }}>
            Showing {filteredEvents.length} of {events.length} events
          </span>
          {hasActiveFilters && (
            <span style={{
              color: "#8B7355",
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif"
            }}>
              Filters applied
            </span>
          )}
        </div>
      </motion.div>

      {/* Events Grid */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
        gap: isMobile ? "2rem" : "3rem"
      }}>
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: isMobile ? "16px" : "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
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
              SEARCH
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>
              {hasActiveFilters ? "No events match your filters" : "No events available"}
            </h3>
            <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
              {hasActiveFilters
                ? "Try adjusting your search criteria or clearing some filters."
                : "Check back later for upcoming community events."
              }
            </p>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                style={{
                  marginTop: "1.5rem",
                  background: "#8B7355",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Clear All Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{
              y: isMobile ? 0 : -8,
              boxShadow: isMobile ? "0 8px 32px rgba(0,0,0,0.08)" : "0 25px 50px rgba(0,0,0,0.15)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            onClick={() => setSelectedEvent(event)}
            style={{
              background: "white",
              borderRadius: isMobile ? "16px" : "20px",
              padding: isMobile ? "2rem" : "3rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid rgba(249, 245, 237, 0.6)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background decoration */}
            <div style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "120px",
              height: "120px",
              background: "radial-gradient(circle, rgba(102,126,234,0.06) 0%, transparent 70%)",
              borderRadius: "50%"
            }} />

            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.5rem",
              position: "relative",
              zIndex: 1
            }}>
              <div style={{
                width: isMobile ? "60px" : "70px",
                height: isMobile ? "60px" : "70px",
                borderRadius: "18px",
                background: "#8B7355",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)",
                border: "2px solid rgba(255,255,255,0.8)"
              }}>
                CALENDAR
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: isMobile ? "1.4rem" : "1.6rem",
                  fontWeight: 700,
                  color: "#231a13",
                  margin: "0 0 1rem 0",
                  lineHeight: 1.3,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {event.title}
                </h3>
                <p style={{
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  color: "#666",
                  margin: "0 0 1.5rem 0",
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {event.description}
                </p>

                <div style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "1rem",
                  alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: "space-between"
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

                  <div style={{
                    background: "#8B7355",
                    color: "white",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "center"
                  }}>
                    {event.date}
                  </div>
                </div>

                <div style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(232,220,192,0.2)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Attendees:
                    </span>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {event.attendees.join(", ")}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <span style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Time:
                    </span>
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "3rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ×
            </button>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "#8B7355",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                CALENDAR
              </div>
              <div>
                <h2 style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#231a13",
                  margin: "0 0 0.5rem 0",
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {selectedEvent.title}
                </h2>
                <p style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  margin: 0,
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {selectedEvent.date} • {selectedEvent.time}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#231a13",
                margin: "0 0 1rem 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                About This Event
              </h3>
              <p style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "#555",
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                {selectedEvent.description}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#231a13",
                margin: "0 0 1rem 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Location & Details
              </h3>
              <p style={{
                fontSize: "1rem",
                color: "#555",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Location: {selectedEvent.location}
              </p>
              <p style={{
                fontSize: "1rem",
                color: "#555",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Organized by {selectedEvent.curator}
              </p>
              <p style={{
                fontSize: "1rem",
                color: "#555",
                margin: 0,
                fontFamily: "'Inter', sans-serif"
              }}>
                Category: {selectedEvent.category}
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#231a13",
                margin: "0 0 1rem 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Who's Attending
              </h3>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}>
                {selectedEvent.attendees.map((attendee, index) => (
                  <span
                    key={index}
                    style={{
                      background: "rgba(232,220,192,0.2)",
                      color: "#231a13",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "15px",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "#8B7355",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.3s ease"
              }}
            >
              Join This Event
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Events;
