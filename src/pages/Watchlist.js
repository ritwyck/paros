import React, { useState, useEffect } from "react";

// Watchlist Page Component
const Watchlist = ({ user, isDarkMode, onMessage, onReport, users }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");

  // Load watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem(`paros_watchlist_${user.id}`);
    if (savedWatchlist) {
      setWatchlistItems(JSON.parse(savedWatchlist));
    }
  }, [user.id]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`paros_watchlist_${user.id}`, JSON.stringify(watchlistItems));
  }, [watchlistItems, user.id]);

  const removeFromWatchlist = (itemId, type) => {
    setWatchlistItems(prev => prev.filter(item => !(item.id === itemId && item.type === type)));
  };

  const listings = watchlistItems.filter(item => item.type === "listing");
  const events = watchlistItems.filter(item => item.type === "event");

  const renderListingCard = (listing) => (
    <div key={listing.id} style={{
      background: "white",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #E8DCC0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#231a13", fontSize: "1.1rem" }}>
            {listing.title}
          </h3>
          <p style={{ margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
            {listing.description?.substring(0, 100)}...
          </p>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#666" }}>
            <span>📍 {listing.location}</span>
            {listing.price && <span>💰 €{listing.price}</span>}
            <span>🏷️ {listing.category}</span>
          </div>
        </div>
        <button
          onClick={() => removeFromWatchlist(listing.id, "listing")}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Remove from watchlist"
        >
          ×
        </button>
      </div>
    </div>
  );

  const renderEventCard = (event) => (
    <div key={event.id} style={{
      background: "white",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #E8DCC0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#231a13", fontSize: "1.1rem" }}>
            {event.title}
          </h3>
          <p style={{ margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.9rem" }}>
            {event.description?.substring(0, 100)}...
          </p>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#666" }}>
            <span>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</span>
            <span>📍 {event.location}</span>
            {event.price > 0 && <span>💰 €{event.price}</span>}
            <span>🏷️ {event.category}</span>
          </div>
        </div>
        <button
          onClick={() => removeFromWatchlist(event.id, "event")}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Remove from watchlist"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#231a13", marginBottom: "1rem" }}>My Watchlist</h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Keep track of items and events you're interested in
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        marginBottom: "2rem",
        borderBottom: "2px solid #E8DCC0"
      }}>
        <button
          onClick={() => setActiveTab("listings")}
          style={{
            padding: "1rem 2rem",
            background: activeTab === "listings" ? "#E8DCC0" : "transparent",
            border: "none",
            borderBottom: activeTab === "listings" ? "3px solid #8B7355" : "3px solid transparent",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "listings" ? "bold" : "normal",
            color: "#231a13"
          }}
        >
          Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          style={{
            padding: "1rem 2rem",
            background: activeTab === "events" ? "#E8DCC0" : "transparent",
            border: "none",
            borderBottom: activeTab === "events" ? "3px solid #8B7355" : "3px solid transparent",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "events" ? "bold" : "normal",
            color: "#231a13"
          }}
        >
          Events ({events.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "listings" && (
        <div>
          {listings.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              background: "#F9F6F0",
              borderRadius: "12px",
              border: "2px dashed #E8DCC0"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#231a13" }}>No saved listings yet</h3>
              <p>Browse listings and add them to your watchlist to keep track of items you're interested in.</p>
            </div>
          ) : (
            listings.map(renderListingCard)
          )}
        </div>
      )}

      {activeTab === "events" && (
        <div>
          {events.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              background: "#F9F6F0",
              borderRadius: "12px",
              border: "2px dashed #E8DCC0"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#231a13" }}>No saved events yet</h3>
              <p>Browse events and add them to your watchlist to keep track of events you want to attend.</p>
            </div>
          ) : (
            events.map(renderEventCard)
          )}
        </div>
      )}

      {/* Stats */}
      {watchlistItems.length > 0 && (
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#F9F6F0",
          borderRadius: "8px",
          border: "1px solid #E8DCC0",
          textAlign: "center"
        }}>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            Total items in watchlist: <strong>{watchlistItems.length}</strong>
            ({listings.length} listings, {events.length} events)
          </p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
