import React, { useState } from "react";
import LocationPicker from "./LocationPicker";

const hobbiesOptions = [
  "Gardening",
  "Cooking",
  "Painting",
  "Writing",
  "Photography",
  "Traveling",
  "Coding",
  "Music",
  "Yoga",
  "Volunteering",
];

const interestsOptions = [
  "Sustainability",
  "Technology",
  "Arts & Culture",
  "Health & Wellness",
  "Community Building",
  "Education",
  "Sports",
  "Entrepreneurship",
];

const motivationsOptions = [
  "Learning",
  "Helping Others",
  "Networking",
  "Creativity",
  "Career Growth",
  "Personal Fulfillment",
  "Social Impact",
];

function UserProfile({ user, setUser }) {
  const [profileLinks, setProfileLinks] = useState(
    user.profileLinks || {
      behance: "",
      linkedin: "",
      github: "",
      instagram: "",
    }
  );

  const [toggles, setToggles] = useState(
    user.toggles || {
      hobbies: [],
      interests: [],
      motivations: [],
    }
  );

  const [location, setLocation] = useState(user.location || null);

  const [username, setUsername] = useState(user.username || "");
  const [profileImage, setProfileImage] = useState(user.profilePic || null);

  const handleLinkChange = (e) => {
    setProfileLinks({ ...profileLinks, [e.target.name]: e.target.value });
  };

  const handleToggle = (category, option) => {
    setToggles((prev) => {
      const current = new Set(prev[category]);
      if (current.has(option)) {
        current.delete(option);
      } else {
        current.add(option);
      }
      return { ...prev, [category]: Array.from(current) };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    const profileData = {
      username,
      profilePic: profileImage,
      profileLinks,
      hobbies: toggles.hobbies,
      interests: toggles.interests,
      motivations: toggles.motivations,
      location,
    };
    setUser(profileData);
    alert("Profile saved!");
    console.log("Saved profile data:", profileData);
  };

  const renderToggleGroup = (title, category, options) => (
    <section>
      <h3>{title}</h3>
      <div>
        {options.map((option) => {
          const checked = toggles[category].includes(option);
          return (
            <label
              key={option}
              className={`toggle-pill ${checked ? "checked" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(category, option)}
              />
              {option}
            </label>
          );
        })}
      </div>
    </section>
  );

  return (
    <form onSubmit={handleSubmit} aria-label="User Profile form">
      <h2>User Profile</h2>

      <section>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          required
        />

        <label htmlFor="profileImage">Profile Picture</label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          aria-describedby="profileImageDesc"
        />
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-avatar"
            aria-describedby="profileImageDesc"
          />
        )}

        <label htmlFor="behance">Behance URL</label>
        <input
          id="behance"
          name="behance"
          type="url"
          value={profileLinks.behance}
          onChange={handleLinkChange}
          placeholder="https://www.behance.net/yourprofile"
        />

        <label htmlFor="linkedin">LinkedIn URL</label>
        <input
          id="linkedin"
          name="linkedin"
          type="url"
          value={profileLinks.linkedin}
          onChange={handleLinkChange}
          placeholder="https://www.linkedin.com/in/yourprofile"
        />

        <label htmlFor="github">GitHub URL</label>
        <input
          id="github"
          name="github"
          type="url"
          value={profileLinks.github}
          onChange={handleLinkChange}
          placeholder="https://github.com/yourprofile"
        />

        <label htmlFor="instagram">Instagram URL</label>
        <input
          id="instagram"
          name="instagram"
          type="url"
          value={profileLinks.instagram}
          onChange={handleLinkChange}
          placeholder="https://www.instagram.com/yourprofile"
        />
      </section>

      <section>
        <h3>Location</h3>
        <LocationPicker location={location} setLocation={setLocation} />
      </section>

      {renderToggleGroup("Hobbies", "hobbies", hobbiesOptions)}
      {renderToggleGroup("Interests", "interests", interestsOptions)}
      {renderToggleGroup("Motivations", "motivations", motivationsOptions)}

      <button type="submit">Save Profile</button>
    </form>
  );
}

export default UserProfile;
