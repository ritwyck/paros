import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Predefined options for skills
const skillOptions = [
  "Gardening & Landscaping",
  "Home Repairs & Maintenance",
  "Cooking & Baking",
  "Tutoring & Teaching",
  "Computer Help & Tech Support",
  "Pet Care & Walking",
  "Moving & Transportation",
  "Event Planning",
  "Photography & Videography",
  "Music Lessons",
  "Language Tutoring",
  "Fitness Training",
  "Cleaning & Organization",
  "Childcare & Babysitting",
  "Sewing & Tailoring",
  "Carpentry & Woodworking",
  "Plumbing & Electrical",
  "Automotive Repair",
  "Graphic Design",
  "Writing & Editing"
];

// Predefined options for lending
const lendingOptions = [
  "Power Tools (drill, saw, etc.)",
  "Lawn Equipment (mower, trimmer)",
  "Kitchen Appliances",
  "Party Supplies (tables, chairs)",
  "Sports Equipment",
  "Camping Gear",
  "Books & Educational Materials",
  "Board Games & Entertainment",
  "Bicycle & Accessories",
  "Garden Tools",
  "Art Supplies",
  "Musical Instruments",
  "Camera Equipment",
  "Office Equipment",
  "Outdoor Furniture",
  "Storage Containers",
  " ladders & Step Stools",
  "Cleaning Supplies",
  "Baby Equipment",
  "Wheelchair & Mobility Aids"
];

function UserProfile({ user, setUser, isDarkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [profileData, setProfileData] = useState({
    username: user.username || "",
    preferredName: user.preferredName || "",
    country: user.country || "Netherlands",
    province: user.province || "Limburg",
    city: user.city || "Maastricht",
    pinCode: user.pinCode || "",
    aboutMe: user.aboutMe || "",
    skills: user.skills || [],
    customSkills: user.customSkills || [],
    lendingItems: user.lendingItems || [],
    customLending: user.customLending || [],
    barterPreferences: user.barterPreferences || "",
    profileImages: user.profileImages || [null, null, null, null, null, null],
    ...user
  });

  const [currentSection, setCurrentSection] = useState("basic");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customLendingInput, setCustomLendingInput] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLendingToggle = (item) => {
    setProfileData(prev => ({
      ...prev,
      lendingItems: prev.lendingItems.includes(item)
        ? prev.lendingItems.filter(i => i !== item)
        : [...prev.lendingItems, item]
    }));
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !profileData.customSkills.includes(customSkillInput.trim())) {
      setProfileData(prev => ({
        ...prev,
        customSkills: [...prev.customSkills, customSkillInput.trim()]
      }));
      setCustomSkillInput("");
    }
  };

  const removeCustomSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      customSkills: prev.customSkills.filter(s => s !== skill)
    }));
  };

  const addCustomLending = () => {
    if (customLendingInput.trim() && !profileData.customLending.includes(customLendingInput.trim())) {
      setProfileData(prev => ({
        ...prev,
        customLending: [...prev.customLending, customLendingInput.trim()]
      }));
      setCustomLendingInput("");
    }
  };

  const removeCustomLending = (item) => {
    setProfileData(prev => ({
      ...prev,
      customLending: prev.customLending.filter(i => i !== item)
    }));
  };

  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => {
          const newImages = [...prev.profileImages];
          newImages[index] = reader.result;
          return {
            ...prev,
            profileImages: newImages
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profileData.username.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    setUser(profileData);
    alert("Profile saved successfully!");
    console.log("Saved profile data:", profileData);
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "photos", label: "Photos" },
    { id: "skills", label: "Skills & Help" },
    { id: "lending", label: "Lending" },
    { id: "about", label: "About Me" },
    { id: "barter", label: "Barter Preferences" }
  ];

  // Profile View Mode (how others see the profile)
  if (!isEditing) {
    return (
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: "4rem 1rem 6rem",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: isDarkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(251, 248, 241, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "3rem",
            border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
          }}
        >
          {/* Profile Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: isDarkMode ? "#E8DCC0" : "#231a13",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}>
              {profileData.preferredName || profileData.username}
            </h1>
            <p style={{
              fontSize: "1.2rem",
              color: isDarkMode ? "#E8DCC0" : "#666",
              marginBottom: "2rem"
            }}>
              @{profileData.username}
            </p>

            {/* Profile Images Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "1rem",
              maxWidth: "600px",
              margin: "0 auto 2rem"
            }}>
              {profileData.profileImages.slice(0, 6).map((image, index) => (
                image && (
                  <div key={index} style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "2px solid #E8DCC0",
                    margin: "0 auto"
                  }}>
                    <img
                      src={image}
                      alt={`Profile ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Profile Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
            {/* Basic Info */}
            <div>
              <h2 style={{
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                marginBottom: "1.5rem",
                fontSize: "1.8rem",
                fontWeight: 600
              }}>
                Location
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  margin: 0,
                  fontSize: "1.1rem",
                  textAlign: "left"
                }}>
                  {profileData.city}, {profileData.province}, {profileData.country}
                </p>
                {profileData.pinCode && (
                  <p style={{
                    color: isDarkMode ? "#E8DCC0" : "#666",
                    margin: 0,
                    fontSize: "0.9rem",
                    textAlign: "left"
                  }}>
                    PIN: {profileData.pinCode}
                  </p>
                )}
              </div>
            </div>

            {/* About Me */}
            {profileData.aboutMe && (
              <div>
                <h2 style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  marginBottom: "1.5rem",
                  fontSize: "1.8rem",
                  fontWeight: 600
                }}>
                  About Me
                </h2>
                <p style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                  margin: 0
                }}>
                  {profileData.aboutMe}
                </p>
              </div>
            )}
          </div>

          {/* Skills & Lending Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
            {/* Skills I Can Offer */}
            {(profileData.skills.length > 0 || profileData.customSkills.length > 0) && (
              <div>
                <h2 style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  marginBottom: "1.5rem",
                  fontSize: "1.8rem",
                  fontWeight: 600
                }}>
                  Skills I Can Offer
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {[...profileData.skills, ...profileData.customSkills].map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        background: "#E8DCC0",
                        color: "#231a13",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        fontWeight: 600
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Items I Can Lend */}
            {(profileData.lendingItems.length > 0 || profileData.customLending.length > 0) && (
              <div>
                <h2 style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  marginBottom: "1.5rem",
                  fontSize: "1.8rem",
                  fontWeight: 600
                }}>
                  Items I Can Lend
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {[...profileData.lendingItems, ...profileData.customLending].map((item, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        background: "#000000",
                        color: "#E8DCC0",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        fontWeight: 600
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Barter Preferences */}
          {profileData.barterPreferences && (
            <div style={{ marginTop: "3rem" }}>
              <h2 style={{
                color: isDarkMode ? "#E8DCC0" : "#231a13",
                marginBottom: "1.5rem",
                fontSize: "1.8rem",
                fontWeight: 600
              }}>
                Barter Preferences
              </h2>
              <div style={{
                background: isDarkMode ? "rgba(232, 220, 192, 0.05)" : "rgba(232, 220, 192, 0.1)",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #E8DCC0"
              }}>
                <p style={{
                  color: isDarkMode ? "#E8DCC0" : "#231a13",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                  margin: 0
                }}>
                  {profileData.barterPreferences}
                </p>
              </div>
            </div>
          )}

          {/* Edit Profile Button */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #E8DCC0"
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              style={{
                padding: "1rem 3rem",
                backgroundColor: "#231a13",
                color: "#E8DCC0",
                border: "none",
                borderRadius: "25px",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Edit
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div style={{
      position: "relative",
      zIndex: 10,
      padding: "4rem 1rem 6rem",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: isDarkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(251, 248, 241, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "2rem",
          border: `1px solid ${isDarkMode ? "rgba(129, 115, 105, 0.4)" : "rgba(249, 245, 237, 0.4)"}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMobile ? "1.5rem" : "2rem",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1rem" : "0"
        }}>
          <h1 style={{
            fontSize: isMobile ? "2rem" : "2.5rem",
            fontWeight: 700,
            color: isDarkMode ? "#E8DCC0" : "#231a13",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: 0
          }}>
            Edit Profile
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(false)}
            style={{
              padding: isMobile ? "0.7rem 1.2rem" : "0.8rem 1.5rem",
              backgroundColor: "#E8DCC0",
              color: "#231a13",
              border: "2px solid #231a13",
              borderRadius: "25px",
              fontSize: isMobile ? "0.9rem" : "1rem",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            View Profile
          </motion.button>
        </div>

        {/* Section Navigation */}
        <div style={{
          display: "flex",
          gap: isMobile ? "0.3rem" : "0.5rem",
          marginBottom: isMobile ? "1.5rem" : "2rem",
          flexWrap: "wrap",
          justifyContent: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "row" : "row"
        }}>
          {sections.map(section => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection(section.id)}
              style={{
                padding: isMobile ? "0.6rem 0.8rem" : "0.8rem 1.2rem",
                borderRadius: "25px",
                border: currentSection === section.id ? "2px solid #231a13" : "2px solid #E8DCC0",
                background: currentSection === section.id ? "#231a13" : "#E8DCC0",
                color: currentSection === section.id ? "#E8DCC0" : "#231a13",
                cursor: "pointer",
                fontSize: isMobile ? "0.8rem" : "0.9rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              <span>{section.icon}</span>
              {section.label}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          {currentSection === "basic" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: isDarkMode ? "#E8DCC0" : "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Basic Information
              </h2>

              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#231a13"
                  }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Your unique username"
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: "2px solid #E8DCC0",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "#231a13"
                  }}>
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={profileData.preferredName}
                    onChange={(e) => handleInputChange("preferredName", e.target.value)}
                    placeholder="How you'd like to be called"
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: "2px solid #E8DCC0",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontSize: "0.9rem"
                    }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="Country"
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "2px solid #E8DCC0",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontSize: "0.9rem"
                    }}>
                      Province/State
                    </label>
                    <input
                      type="text"
                      value={profileData.province}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      placeholder="Province/State"
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "2px solid #E8DCC0",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontSize: "0.9rem"
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "2px solid #E8DCC0",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "#231a13",
                      fontSize: "0.9rem"
                    }}>
                      Pin Code
                    </label>
                    <input
                      type="text"
                      value={profileData.pinCode}
                      onChange={(e) => handleInputChange("pinCode", e.target.value)}
                      placeholder="Pin Code"
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: "2px solid #E8DCC0",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Photos Section */}
          {currentSection === "photos" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Profile Photos
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem"
              }}>
                {/* Show first image slot always */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "12px",
                    border: "2px solid #E8DCC0",
                    margin: "0 auto 0.5rem",
                    overflow: "hidden",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}>
                    {profileData.profileImages[0] ? (
                      <img
                        src={profileData.profileImages[0]}
                        alt="Profile 1"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <span style={{ color: "#999", fontSize: "2rem" }}>Camera</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(0, e.target.files[0])}
                    style={{ display: "none" }}
                    id="photo-0"
                  />
                  <label
                    htmlFor="photo-0"
                    style={{
                      display: "inline-block",
                      padding: "0.4rem 0.8rem",
                      background: "#E8DCC0",
                      color: "#231a13",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}
                  >
                    {profileData.profileImages[0] ? "Change" : "Upload"}
                  </label>
                </div>

                {/* Show additional image slots only if showAllPhotos is true */}
                {showAllPhotos && profileData.profileImages.slice(1, 10).map((image, index) => {
                  const actualIndex = index + 1;
                  return (
                    <div key={actualIndex} style={{ textAlign: "center" }}>
                      <div style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        border: "2px solid #E8DCC0",
                        margin: "0 auto 0.5rem",
                        overflow: "hidden",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}>
                        {image ? (
                          <img
                            src={image}
                            alt={`Profile ${actualIndex + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <span style={{ color: "#999", fontSize: "2rem" }}>Camera</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(actualIndex, e.target.files[0])}
                        style={{ display: "none" }}
                        id={`photo-${actualIndex}`}
                      />
                      <label
                        htmlFor={`photo-${actualIndex}`}
                        style={{
                          display: "inline-block",
                          padding: "0.4rem 0.8rem",
                          background: "#E8DCC0",
                          color: "#231a13",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                      >
                        {image ? "Change" : "Upload"}
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Add More Images Button */}
              {!showAllPhotos && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    style={{
                      padding: "0.8rem 2rem",
                      backgroundColor: "#231a13",
                      color: "#E8DCC0",
                      border: "2px solid #231a13",
                      borderRadius: "25px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                  >
                    Add More Images
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Skills Section */}
          {currentSection === "skills" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Skills I Can Offer
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#231a13", marginBottom: "1rem", fontSize: "1.1rem" }}>
                  Choose from common skills:
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.5rem"
                }}>
                  {skillOptions.map(skill => (
                    <label
                      key={skill}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: profileData.skills.includes(skill) ? "2px solid #231a13" : "2px solid #E8DCC0",
                        background: profileData.skills.includes(skill) ? "#231a13" : "#E8DCC0",
                        color: profileData.skills.includes(skill) ? "#E8DCC0" : "#231a13",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={profileData.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        style={{ display: "none" }}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: "#231a13", marginBottom: "1rem", fontSize: "1.1rem" }}>
                  Add your own skills:
                </h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Enter a custom skill..."
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "2px solid #E8DCC0",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    style={{
                      padding: "0.6rem 1rem",
                      background: "#231a13",
                      color: "#E8DCC0",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {profileData.customSkills.map(skill => (
                    <span
                      key={skill}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.4rem 0.8rem",
                        background: "#231a13",
                        color: "#E8DCC0",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeCustomSkill(skill)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#E8DCC0",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: 0,
                          marginLeft: "0.2rem"
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Lending Section */}
          {currentSection === "lending" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Items I Can Lend
              </h2>

              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#231a13", marginBottom: "1rem", fontSize: "1.1rem" }}>
                  Choose from common items:
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.5rem"
                }}>
                  {lendingOptions.map(item => (
                    <label
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: profileData.lendingItems.includes(item) ? "2px solid #231a13" : "2px solid #E8DCC0",
                        background: profileData.lendingItems.includes(item) ? "#231a13" : "#E8DCC0",
                        color: profileData.lendingItems.includes(item) ? "#E8DCC0" : "#231a13",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={profileData.lendingItems.includes(item)}
                        onChange={() => handleLendingToggle(item)}
                        style={{ display: "none" }}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ color: "#231a13", marginBottom: "1rem", fontSize: "1.1rem" }}>
                  Add your own items:
                </h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    value={customLendingInput}
                    onChange={(e) => setCustomLendingInput(e.target.value)}
                    placeholder="Enter an item you can lend..."
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "2px solid #E8DCC0",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomLending}
                    style={{
                      padding: "0.6rem 1rem",
                      background: "#231a13",
                      color: "#E8DCC0",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {profileData.customLending.map(item => (
                    <span
                      key={item}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.4rem 0.8rem",
                        background: "#231a13",
                        color: "#E8DCC0",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeCustomLending(item)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#E8DCC0",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: 0,
                          marginLeft: "0.2rem"
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* About Me Section */}
          {currentSection === "about" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                About Me
              </h2>

              <textarea
                value={profileData.aboutMe}
                onChange={(e) => handleInputChange("aboutMe", e.target.value)}
                placeholder="Tell others about yourself, your interests, and what you're looking for in your community..."
                rows={8}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "2px solid #E8DCC0",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.5
                }}
              />
            </motion.div>
          )}

          {/* Barter Preferences Section */}
          {currentSection === "barter" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ color: "#231a13", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
                Barter Preferences
              </h2>

              <div style={{ marginBottom: "1rem" }}>
                <p style={{ color: "#231a13", marginBottom: "1rem" }}>
                  Are you open to bartering your services for other goods or services?
                </p>
                <textarea
                  value={profileData.barterPreferences}
                  onChange={(e) => handleInputChange("barterPreferences", e.target.value)}
                  placeholder="Describe what you're open to bartering for (e.g., 'Happy to trade gardening help for cooking lessons or fresh produce' or 'Prefer cash but open to creative trades')"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "2px solid #E8DCC0",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: 1.5
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid #E8DCC0"
          }}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 3rem",
                backgroundColor: "#231a13",
                color: "#E8DCC0",
                border: "none",
                borderRadius: "25px",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Save Profile
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UserProfile;
