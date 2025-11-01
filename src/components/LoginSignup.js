import React, { useState } from "react";

function LoginSignup({ onLogin }) {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    onLogin({ username, profilePic, email: "", profileLinks: {}, toggles: {} });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 20,
        backgroundColor: "#F5F1E7", // beige from palette
        borderRadius: 16,
        boxShadow: "0 4px 10px rgba(107, 76, 59, 0.3)",
        fontFamily: "'Comfortaa', cursive",
        color: "#6B4C3B", // brown from palette
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#4B7F52" }}>
        Join Paros
      </h2>

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose your username"
        style={{
          width: "100%",
          padding: "0.6rem 1rem",
          fontSize: "1rem",
          borderRadius: 12,
          border: "2px solid #4B7F52",
          marginBottom: 16,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#F9D342")}
        onBlur={(e) => (e.target.style.borderColor = "#4B7F52")}
      />

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Profile Picture (optional)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePicChange}
        style={{ marginBottom: 16 }}
      />
      {profilePic && (
        <img
          src={profilePic}
          alt="Profile preview"
          style={{
            display: "block",
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: "50%",
            margin: "0 auto 16px",
            border: "3px solid #F9D342",
            boxShadow: "0 0 12px #F9D342aa",
          }}
        />
      )}

      {error && (
        <p style={{ color: "red", fontWeight: "600", marginBottom: 16, textAlign: "center" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.75rem 0",
          backgroundColor: "#F9D342",
          border: "none",
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 18,
          color: "#4B7F52",
          cursor: "pointer",
          boxShadow: "0 4px 14px #F9D342aa",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#4B7F52")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#F9D342")}
      >
        Let’s Go!
      </button>
    </form>
  );
}

export default LoginSignup;
