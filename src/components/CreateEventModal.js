import React, { useState } from "react";
import { motion } from "framer-motion";

// Create Event Modal Component
const CreateEventModal = ({ isOpen, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    price: "",
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Social", "Educational", "Sports", "Arts & Culture", "Music", "Food & Drink",
    "Networking", "Volunteering", "Technology", "Health & Wellness", "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check if date is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      alert("Event date and time must be in the future.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newEvent = {
        id: Date.now(),
        organizerId: currentUser.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim() || currentUser.city,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        status: "active",
        attendees: [currentUser.id] // Organizer is automatically an attendee
      };

      // Store event in localStorage (in a real app, this would be sent to a server)
      const existingEvents = JSON.parse(localStorage.getItem('paros_user_events') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('paros_user_events', JSON.stringify(existingEvents));

      alert("Event created successfully!");
      setIsSubmitting(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
        price: "",
        tags: []
      });
      onClose();
    }, 1000);
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
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
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
          <h3 style={{ margin: 0, color: "#231a13", fontSize: "1.3rem" }}>
            Create New Event
          </h3>
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

        {/* Form */}
        <div style={{
          flex: 1,
          padding: "1.5rem",
          overflowY: "auto"
        }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Title */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="What's your event called?"
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

            {/* Category */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#231a13"
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
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
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#231a13"
                }}>
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
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

            {/* Location */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder={currentUser.city || "Venue address or location"}
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

            {/* Attendees and Price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#231a13"
                }}>
                  Max Attendees
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                  placeholder="Unlimited"
                  min="1"
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
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#231a13"
                }}>
                  Price (€)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Free"
                  min="0"
                  step="0.01"
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

            {/* Description */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Tell people about your event..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #E8DCC0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Tags placeholder */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Tags
              </label>
              <div style={{
                border: "2px dashed #E8DCC0",
                borderRadius: "8px",
                padding: "2rem",
                textAlign: "center",
                color: "#666"
              }}>
                <p>🏷️ Tags coming soon</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Help people find your event with relevant tags
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #E8DCC0",
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end"
        }}>
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
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.category || !formData.date || !formData.time}
            style={{
              padding: "0.75rem 1.5rem",
              background: (formData.title.trim() && formData.description.trim() && formData.category && formData.date && formData.time && !isSubmitting) ? "#8B7355" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (formData.title.trim() && formData.description.trim() && formData.category && formData.date && formData.time && !isSubmitting) ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateEventModal;
