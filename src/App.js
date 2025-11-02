import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import Events from "./components/Events";

// Import extracted components
import { ErrorBoundary } from "./layout";
import { GlobalMapBackground, Navigation, Footer } from "./layout";
import { Dashboard, MessagesPage, SwipeableListings, Watchlist } from "./pages";
import { MessagingModal, ReportingModal, CreateListingModal, CreateEventModal } from "./components";

// Import data
import { dummyUsers, dummyListings, dummyEvents } from "./data";

// Import utilities
import "./utils/leaflet";

import "./index.css";

// Main App Component
function App() {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('paros_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem('paros_page');
    return savedPage || "browse";
  });

  // Messaging and reporting state
  const [messagingModal, setMessagingModal] = useState({ isOpen: false, recipient: null });
  const [reportingModal, setReportingModal] = useState({ isOpen: false, targetUser: null });
  const [createListingModal, setCreateListingModal] = useState({ isOpen: false });
  const [createEventModal, setCreateEventModal] = useState({ isOpen: false });

  const isDarkMode = false;

  // Save user and page state to localStorage whenever they change
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('paros_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('paros_user');
    }
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('paros_page', page);
  }, [page]);

  function onLoginSuccess(userData) {
    // Set logged-in user as user 0 (demo)
    setUser({
      id: 0,
      username: "demo",
      preferredName: "Demo User",
      country: "Netherlands",
      province: "North Holland",
      city: "Amsterdam",
      pinCode: "1000",
      aboutMe: "Demo user for testing the Paros community platform.",
      skills: ["Testing", "Demo"],
      customSkills: [],
      lendingItems: ["Demo Items"],
      customLending: [],
      barterPreferences: "Open to demo exchanges.",
      profileImages: [null, null, null, null, null, null],
      trustScore: 5.0,
      joinDate: new Date().toISOString().split('T')[0]
    });
    setPage("profile");
  }

  function handleLogout() {
    setUser(null);
    setPage("dashboard");
    // Clear localStorage on logout
    localStorage.removeItem('paros_user');
    localStorage.removeItem('paros_page');
  }

  const navigateTo = (pageName) => setPage(pageName);

  const openMessaging = (recipient) => {
    setMessagingModal({ isOpen: true, recipient });
  };

  const closeMessaging = () => {
    setMessagingModal({ isOpen: false, recipient: null });
  };

  const openReporting = (targetUser) => {
    setReportingModal({ isOpen: true, targetUser });
  };

  const closeReporting = () => {
    setReportingModal({ isOpen: false, targetUser: null });
  };

  const openCreateListing = () => {
    setCreateListingModal({ isOpen: true });
  };

  const closeCreateListing = () => {
    setCreateListingModal({ isOpen: false });
  };

  const openCreateEvent = () => {
    setCreateEventModal({ isOpen: true });
  };

  const closeCreateEvent = () => {
    setCreateEventModal({ isOpen: false });
  };

  if (!user) {
    return <LandingPage onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
      <GlobalMapBackground isDarkMode={isDarkMode} user={user} />
      <Navigation
        currentPage={page}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      <div style={{ overflowX: "hidden", marginTop: "120px" }}>
        {page === "dashboard" && (
          <Dashboard
            user={user}
            isDarkMode={isDarkMode}
            onNavigate={navigateTo}
            listings={dummyListings}
            events={dummyEvents}
            onMessage={openMessaging}
            onReport={openReporting}
            users={dummyUsers}
          />
        )}
        {page === "messages" && (
          <MessagesPage
            currentUser={user}
            users={dummyUsers}
            onMessage={openMessaging}
          />
        )}
        {page === "profile" && <UserProfile user={user} setUser={setUser} isDarkMode={isDarkMode} />}
        {page === "browse" && <SwipeableListings listings={dummyListings} isDarkMode={isDarkMode} onCreateListing={openCreateListing} user={user} onMessage={openMessaging} onReport={openReporting} users={dummyUsers} />}
        {page === "events" && <Events events={dummyEvents} isDarkMode={isDarkMode} onCreateEvent={openCreateEvent} />}
        {page === "watchlist" && <Watchlist user={user} isDarkMode={isDarkMode} onMessage={openMessaging} onReport={openReporting} users={dummyUsers} />}
        {page === "create" && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Create New Masterpiece Coming Soon</h2>
            <p>This feature will allow you to create new listings and events.</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Messaging Modal */}
      <MessagingModal
        isOpen={messagingModal.isOpen}
        onClose={closeMessaging}
        recipient={messagingModal.recipient}
        currentUser={user}
        users={dummyUsers}
      />

      {/* Reporting Modal */}
      <ReportingModal
        isOpen={reportingModal.isOpen}
        onClose={closeReporting}
        targetUser={reportingModal.targetUser}
        currentUser={user}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={createListingModal.isOpen}
        onClose={closeCreateListing}
        currentUser={user}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createEventModal.isOpen}
        onClose={closeCreateEvent}
        currentUser={user}
      />
    </>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
