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
        backgroundColor: "#F7F6F3", // gallery gray
        borderRadius: 16,
        boxShadow: "0 4px 10px rgba(0, 77, 64, 0.3)",
        fontFamily: "'Inter', sans-serif",
        color: "#231a13", // espresso
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#004d40" }}>
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
          border: "2px solid #004d40",
          marginBottom: 16,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#004d40")}
        onBlur={(e) => (e.target.style.borderColor = "#004d40")}
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
            border: "3px solid #004d40",
            boxShadow: "0 0 12px #004d40aa",
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
          backgroundColor: "#004d40",
          border: "none",
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 18,
          color: "#FFFFFF",
          cursor: "pointer",
          boxShadow: "0 4px 14px #004d40aa",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#231a13")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#004d40")}
      >
        Let’s Go!
      </button>
    </form>
  );
}

export default LoginSignup;
