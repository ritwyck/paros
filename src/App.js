import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";

const dummyListings = [
  {
    id: 1,
    title: "Garden Help",
    category: "service",
    description: "Help with gardening tasks",
    location: "Local area A",
  },
  {
    id: 2,
    title: "Guitar Lessons",
    category: "skill",
    description: "Private guitar lessons for beginners",
    location: "Local area B",
  },
  {
    id: 3,
    title: "Lawn Mower",
    category: "good",
    description: "Lawn mower available to borrow",
    location: "Local area A",
  },
];

const dummyEvents = [
  {
    id: 1,
    title: "Community Gardening Day",
    date: "2025-11-05",
    location: "Local Park",
    description: "Join us for a community garden work day!",
  },
  {
    id: 2,
    title: "Open Mic Night",
    date: "2025-11-12",
    location: "Community Center",
    description: "Showcase your talents at the local open mic.",
  },
];

function Listings({ listings }) {
  const [filter, setFilter] = React.useState("all");

  const filtered = listings.filter((l) => filter === "all" || l.category === filter);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>Browse Listings</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Filter by category:{" "}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: 6, fontSize: 16, borderRadius: 6 }}
          >
            <option value="all">All</option>
            <option value="service">Service</option>
            <option value="skill">Skill</option>
            <option value="good">Good</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 && <p>No listings match the filter.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map(({ id, title, description, location, category }) => (
          <li
            key={id}
            style={{
              background: "#fafafa",
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{title}</strong> ({category}) <br />
            <em>{location}</em>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Events({ events }) {
  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>Local Events</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map(({ id, title, date, location, description }) => (
          <li
            key={id}
            style={{
              background: "#fefefe",
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{title}</strong> <br />
            <small>
              {date} | {location}
            </small>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navigation({ currentPage, setPage, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#4B7F52", // green from theme
        color: "#FCF8F2", // offwhite
        padding: "1rem 2rem",
        alignItems: "center",
        fontSize: "1.15rem",
        fontWeight: "600",
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 4px 12px rgba(75, 127, 82, 0.2)",
      }}
    >
      <div>
        <strong style={{ fontSize: 20, cursor: "pointer" }} onClick={() => setPage("browse")}>
          Paros
        </strong>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <button
          onClick={() => setPage("browse")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "browse" ? "#F9D342" : "#FCF8F2",
            cursor: "pointer",
            fontSize: 16,
          }}
          aria-current={currentPage === "browse"}
        >
          Listings
        </button>
        <button
          onClick={() => setPage("events")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "events" ? "#F9D342" : "#FCF8F2",
            cursor: "pointer",
            fontSize: 16,
          }}
          aria-current={currentPage === "events"}
        >
          Events
        </button>
        <button
          onClick={() => setPage("profile")}
          style={{
            background: "none",
            border: "none",
            color: currentPage === "profile" ? "#F9D342" : "#FCF8F2",
            cursor: "pointer",
            fontSize: 16,
          }}
          aria-current={currentPage === "profile"}
        >
          Profile
        </button>
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: "none",
            color: "#FCF8F2",
            cursor: "pointer",
            fontSize: 16,
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(null);

  function onLoginSuccess(userData) {
    setUser(userData);
    setPage("browse");
  }

  function handleLogout() {
    setUser(null);
    setPage(null);
  }

  if (!user) {
    return <LandingPage onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
      <Navigation currentPage={page} setPage={setPage} onLogout={handleLogout} />
      {page === "profile" && <UserProfile user={user} setUser={setUser} />}
      {page === "browse" && <Listings listings={dummyListings} />}
      {page === "events" && <Events events={dummyEvents} />}
    </>
  );
}

export default App;
