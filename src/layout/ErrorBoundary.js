import React from "react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Formal work in progress page
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f1e7 0%, #e8dcc0 100%)",
          fontFamily: "'Inter', sans-serif",
          padding: "2rem",
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: "600px",
            background: "white",
            borderRadius: "20px",
            padding: "3rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "1px solid rgba(232,220,192,0.3)"
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B7355 0%, #D4C4A8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              boxShadow: "0 8px 32px rgba(139, 115, 85, 0.3)"
            }}>
              <div style={{
                fontSize: "3rem",
                color: "white"
              }}>
                🔧
              </div>
            </div>

            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: 600,
              color: "#231a13",
              margin: "0 0 1rem 0",
              letterSpacing: "0.02em"
            }}>
              Work in Progress
            </h1>

            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              margin: "0 0 2rem 0",
              lineHeight: 1.6
            }}>
              We're currently refining this feature to provide you with the best possible experience.
              Our team is working diligently to bring you an enhanced version soon.
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center"
            }}>
              <div style={{
                padding: "1rem 2rem",
                background: "linear-gradient(135deg, #8B7355 0%, #D4C4A8 100%)",
                color: "white",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 16px rgba(139, 115, 85, 0.3)"
              }}>
                Expected Completion: Coming Soon
              </div>

              <p style={{
                fontSize: "0.9rem",
                color: "#999",
                margin: "1rem 0 0 0"
              }}>
                Thank you for your patience and understanding.
              </p>
            </div>
          </div>

          <div style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.8rem",
            color: "#999",
            textAlign: "center"
          }}>
            <div>Paros Community Platform</div>
            <div>© 2025 Paros. Building stronger communities.</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
