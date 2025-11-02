import React, { useState } from "react";
import { motion } from "framer-motion";

// Messages Page Component
const MessagesPage = ({ currentUser, users, onMessage }) => {
  const [conversations, setConversations] = useState([]);

  React.useEffect(() => {
    // Find all conversations for the current user
    const userConversations = [];

    users.forEach(otherUser => {
      if (otherUser.id !== currentUser.id) {
        // Use consistent key ordering (smaller ID first)
        const conversationKey = `messages_v2_${Math.min(currentUser.id, otherUser.id)}_${Math.max(currentUser.id, otherUser.id)}`;
        const messages = localStorage.getItem(conversationKey);

        if (messages) {
          const parsedMessages = JSON.parse(messages);
          if (parsedMessages.length > 0) {
            // Sort messages by timestamp and get the last one
            parsedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const lastMessage = parsedMessages[parsedMessages.length - 1];

            userConversations.push({
              user: otherUser,
              lastMessage,
              messageCount: parsedMessages.length,
              lastMessageTime: new Date(lastMessage.timestamp)
            });
          }
        }
      }
    });

    // Sort by most recent message
    userConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    setConversations(userConversations);
  }, [currentUser, users]);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
            Your Messages
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
          Connect with your community members
        </motion.p>
      </motion.div>

      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "grid",
        gap: "1rem"
      }}>
        {conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
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
              0
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#231a13" }}>No messages yet</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
              Start conversations by messaging people from listings and events!
            </p>
          </motion.div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => onMessage(conversation.user)}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
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
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                zIndex: 1
              }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#8B7355",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)"
                }}>
                  {conversation.user.preferredName?.charAt(0) || conversation.user.username?.charAt(0)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: "#231a13",
                      fontSize: "1.3rem",
                      fontWeight: 600
                    }}>
                      {conversation.user.preferredName || conversation.user.username}
                    </h3>
                    <span style={{
                      color: "#999",
                      fontSize: "0.9rem",
                      fontWeight: 500
                    }}>
                      {conversation.lastMessageTime.toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{
                    margin: "0 0 0.5rem 0",
                    color: "#666",
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {conversation.lastMessage.text}
                  </p>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <span style={{
                      background: "#E8DCC0",
                      color: "#231a13",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}>
                      Trust Score: {conversation.user.trustScore}
                    </span>
                    <span style={{
                      color: "#999",
                      fontSize: "0.9rem"
                    }}>
                      {conversation.messageCount} message{conversation.messageCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div style={{
                  color: "#8B7355",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  →
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
