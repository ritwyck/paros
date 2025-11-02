import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Messaging Component
const MessagingModal = ({ isOpen, onClose, recipient, currentUser, users }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Load messages when recipient changes
  React.useEffect(() => {
    if (recipient && currentUser) {
      // Use consistent key ordering (smaller ID first)
      const conversationKey = `messages_v2_${Math.min(currentUser.id, recipient.id)}_${Math.max(currentUser.id, recipient.id)}`;
      const saved = localStorage.getItem(conversationKey);
      setMessages(saved ? JSON.parse(saved) : []);
    } else {
      setMessages([]);
    }
  }, [recipient, currentUser]);

  const recipientData = recipient ? users.find(u => u.id === recipient.id) : null;

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        recipientId: recipient.id,
        text: message.trim(),
        timestamp: new Date().toISOString()
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Use consistent key ordering (smaller ID first)
      const conversationKey = `messages_v2_${Math.min(currentUser.id, recipient.id)}_${Math.max(currentUser.id, recipient.id)}`;
      localStorage.setItem(conversationKey, JSON.stringify(updatedMessages));
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
          maxWidth: "500px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#8B7355",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
              {recipientData?.preferredName?.charAt(0) || recipient.name?.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#231a13", fontSize: "1.2rem" }}>
                {recipientData?.preferredName || recipient.name}
              </h3>
              <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                Trust Score: {recipientData?.trustScore || "N/A"}
              </p>
              {recipientData?.joinDate && (
                <p style={{ margin: "0.1rem 0 0 0", color: "#666", fontSize: "0.8rem" }}>
                  Member since {new Date(recipientData.joinDate).toLocaleDateString()}
                  {(() => {
                    const joinDate = new Date(recipientData.joinDate);
                    const now = new Date();
                    const diffTime = Math.abs(now - joinDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 30) {
                      return ` (${diffDays} days ago)`;
                    } else if (diffDays < 365) {
                      const months = Math.floor(diffDays / 30);
                      return ` (${months} month${months > 1 ? 's' : ''} ago)`;
                    } else {
                      const years = Math.floor(diffDays / 365);
                      return ` (${years} year${years > 1 ? 's' : ''} ago)`;
                    }
                  })()}
                </p>
              )}
            </div>
          </div>
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

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          maxHeight: "400px"
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              padding: "2rem",
              fontStyle: "italic"
            }}>
              Start a conversation with {recipientData?.preferredName || recipient.name}
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: msg.senderId === currentUser.id ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "70%",
                  padding: "0.75rem 1rem",
                  borderRadius: "18px",
                  background: msg.senderId === currentUser.id ? "#E8DCC0" : "#f5f5f5",
                  color: msg.senderId === currentUser.id ? "#231a13" : "#333",
                  fontSize: "0.9rem",
                  lineHeight: 1.4
                }}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "1rem",
          borderTop: "1px solid #E8DCC0",
          display: "flex",
          gap: "0.5rem"
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              border: "2px solid #E8DCC0",
              borderRadius: "25px",
              outline: "none",
              fontSize: "1rem"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: message.trim() ? "#8B7355" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: message.trim() ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MessagingModal;
