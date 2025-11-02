import React, { useState } from "react";
import { motion } from "framer-motion";

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

export default SwipeableListings;
