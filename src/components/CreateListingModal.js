import React, { useState } from "react";
import { motion } from "framer-motion";

// Create Listing Modal Component
const CreateListingModal = ({ isOpen, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    price: "",
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Vehicles",
    "Tools", "Collectibles", "Art", "Music", "Other"
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newListing = {
        id: Date.now(),
        userId: currentUser.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        condition: formData.condition || "Good",
        location: formData.location.trim() || currentUser.city,
        price: formData.price ? parseFloat(formData.price) : null,
        images: formData.images,
        createdAt: new Date().toISOString(),
        status: "active"
      };

      // Store listing in localStorage (in a real app, this would be sent to a server)
      const existingListings = JSON.parse(localStorage.getItem('paros_user_listings') || '[]');
      existingListings.push(newListing);
      localStorage.setItem('paros_user_listings', JSON.stringify(existingListings));

      alert("Listing created successfully!");
      setIsSubmitting(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "",
        location: "",
        price: "",
        images: []
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
            Create New Listing
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
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="What are you listing?"
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

            {/* Category and Condition */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#231a13"
                }}>
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange("condition", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #E8DCC0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                >
                  <option value="">Select condition...</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location and Price */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
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
                  placeholder={currentUser.city || "City, Province"}
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
                  placeholder="0.00"
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
                placeholder="Describe your item in detail..."
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

            {/* Images placeholder */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#231a13"
              }}>
                Images
              </label>
              <div style={{
                border: "2px dashed #E8DCC0",
                borderRadius: "8px",
                padding: "2rem",
                textAlign: "center",
                color: "#666"
              }}>
                <p>📷 Image upload coming soon</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  For now, images will be added automatically
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
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.category}
            style={{
              padding: "0.75rem 1.5rem",
              background: (formData.title.trim() && formData.description.trim() && formData.category && !isSubmitting) ? "#8B7355" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (formData.title.trim() && formData.description.trim() && formData.category && !isSubmitting) ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListingModal;
