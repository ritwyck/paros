import React, { useState } from "react";

function LoginSignup({ onLogin, isDarkMode }) {
  const [isLoginMode, setIsLoginMode] = useState(true); // true = login, false = signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || (!isLoginMode && !email.trim())) {
      setError("Please fill in all required fields");
      return;
    }
    onLogin({ username, email: isLoginMode ? "" : email, password, isLogin: isLoginMode });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "2.5rem 3rem",
        background: isDarkMode ? "rgba(35, 26, 19, 0.98)" : "rgba(251, 248, 241, 0.98)",
        borderRadius: 0, // Sharp corners for gallery aesthetic
        boxShadow: isDarkMode
          ? "0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 25px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.05)",
        border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
        fontFamily: "'Inter', sans-serif",
        color: isDarkMode ? "#E8DCC0" : "#231a13",
        backdropFilter: "blur(30px)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Art Gallery Frame Effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: isDarkMode
          ? `linear-gradient(90deg, #E8DCC0, #231a13, #E8DCC0)`
          : `linear-gradient(90deg, #231a13, #E8DCC0, #231a13)`,
        opacity: 0.8
      }} />
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: isDarkMode
          ? `linear-gradient(90deg, #E8DCC0, #231a13, #E8DCC0)`
          : `linear-gradient(90deg, #231a13, #E8DCC0, #231a13)`,
        opacity: 0.8
      }} />

      {/* Login/Signup Toggle */}
      <div style={{ display: "flex", marginBottom: "2rem" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsLoginMode(true); }}
          style={{
            flex: 1,
            padding: "0.8rem 0",
            background: isLoginMode ? (isDarkMode ? "#E8DCC0" : "#231a13") : "transparent",
            color: isLoginMode ? (isDarkMode ? "#231a13" : "#E8DCC0") : (isDarkMode ? "#E8DCC0" : "#231a13"),
            border: `1px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
            borderRight: "none",
            borderRadius: 0,
            cursor: "pointer",
            fontWeight: isLoginMode ? 600 : 400,
            fontSize: "1rem",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          LOGIN
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsLoginMode(false); }}
          style={{
            flex: 1,
            padding: "0.8rem 0",
            background: !isLoginMode ? (isDarkMode ? "#E8DCC0" : "#231a13") : "transparent",
            color: !isLoginMode ? (isDarkMode ? "#231a13" : "#E8DCC0") : (isDarkMode ? "#E8DCC0" : "#231a13"),
            border: `1px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
            borderLeft: "none",
            borderRadius: 0,
            cursor: "pointer",
            fontWeight: !isLoginMode ? 600 : 400,
            fontSize: "1rem",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          SIGN UP
        </button>
      </div>

      {/* Artistic Form Title */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: 300,
          letterSpacing: "0.15em",
          margin: 0,
          color: isDarkMode ? "#E8DCC0" : "#231a13",
          textTransform: "uppercase",
          textShadow: isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(255,255,255,0.4)",
        }}>
          {isLoginMode ? "Welcome Back" : "Join Paros"}
        </h1>
        <p style={{
          fontSize: "0.95rem",
          marginTop: "0.5rem",
          opacity: 0.8,
          fontWeight: 400,
          letterSpacing: "0.05em",
          color: isDarkMode ? "#E8DCC0" : "#231a13"
        }}>

        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 2 }}>

        {/* Username Field */}
        <div style={{ marginBottom: "1.4rem" }}>
          <label style={{
            display: "block",
            marginBottom: "0.6rem",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: isDarkMode ? "#E8DCC0" : "#231a13",
            opacity: 0.9
          }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=""
            style={{
              width: "100%",
              padding: "0.9rem 1.2rem",
              fontSize: "1rem",
              borderRadius: 0,
              border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
              background: isDarkMode ? "rgba(35, 26, 19, 0.6)" : "rgba(251, 248, 241, 0.6)",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* Email Field (only for signup) */}
        {!isLoginMode && (
          <div style={{ marginBottom: "1.4rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.6rem",
              fontSize: "1rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              opacity: 0.9
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                fontSize: "1rem",
                borderRadius: 0,
                border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
                background: isDarkMode ? "rgba(35, 26, 19, 0.6)" : "rgba(251, 248, 241, 0.6)",
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Password Field */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            marginBottom: "0.6rem",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: isDarkMode ? "#E8DCC0" : "#231a13",
            opacity: 0.9
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
            style={{
              width: "100%",
              padding: "0.9rem 1.2rem",
              fontSize: "1rem",
              borderRadius: 0,
              border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
              background: isDarkMode ? "rgba(35, 26, 19, 0.6)" : "rgba(251, 248, 241, 0.6)",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: "1.5rem",
            padding: "0.8rem",
            background: isDarkMode ? "rgba(200, 50, 50, 0.15)" : "rgba(255, 200, 200, 0.3)",
            border: `1px solid ${isDarkMode ? "#B71C1C" : "#E57373"}`,
            borderRadius: 0,
            textAlign: "center",
          }}>
            <p style={{
              margin: 0,
              color: isDarkMode ? "#FFCDD2" : "#D32F2F",
              fontWeight: 500,
              letterSpacing: "0.05em",
              fontSize: "0.9rem"
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "1rem 0",
            backgroundColor: isDarkMode ? "#E8DCC0" : "#231a13",
            border: `2px solid ${isDarkMode ? "#E8DCC0" : "#231a13"}`,
            borderRadius: 0,
            fontWeight: 600,
            fontSize: "1.1rem",
            color: isDarkMode ? "#231a13" : "#E8DCC0",
            cursor: "pointer",
            boxShadow: isDarkMode
              ? "0 6px 20px rgba(0,77,64,0.4)"
              : "0 6px 20px rgba(232,220,192,0.3)",
            transition: "all 0.3s ease",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {isLoginMode ? "Login" : "Create Account"}
        </button>

        {/* Demo Info */}
        {isLoginMode && (
          <div style={{
            marginTop: "1.5rem",
            padding: "0.7rem",
            background: isDarkMode ? "rgba(232, 220, 192, 0.1)" : "rgba(35, 26, 19, 0.1)",
            border: `1px solid ${isDarkMode ? "rgba(232, 220, 192, 0.3)" : "rgba(35, 26, 19, 0.3)"}`,
            borderRadius: 0,
            textAlign: "center"
          }}>
            <small style={{
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              opacity: 0.7,
              fontSize: "0.8rem",
              letterSpacing: "0.05em"
            }}>
              Demo: username "demo" - password "demo123"
            </small>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginSignup;
