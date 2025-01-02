import React, { useEffect, useState } from "react";
import "./location.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapMarkerAlt, faEdit, faHome, faBriefcase, faUsers } from "@fortawesome/free-solid-svg-icons";

const LocationsPage = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Retrieve saved locations and recent searches from localStorage
    const saved = JSON.parse(localStorage.getItem("savedLocations")) || [
      { room: "101", area: "Green Valley Apartments", tag: "Home" },
      { room: "5th Floor", area: "Tech Hub Complex", tag: "Office" },
      { room: "Villa 12", area: "Sunshine Avenue", tag: "Family" },
    ];
    const recent = JSON.parse(localStorage.getItem("recentSearches")) || [
      "Central Park",
      "Metro Station 5",
      "Global Mall",
    ];

    setSavedLocations(saved);
    setRecentSearches(recent);
  }, []);

  const handleDeleteLocation = (index) => {
    const updatedLocations = savedLocations.filter((_, i) => i !== index);
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
  };

  const handleUpdateLocation = (index) => {
    const newRoom = prompt("Enter new room/location:", savedLocations[index].room);
    const newArea = prompt("Enter new area:", savedLocations[index].area);
    if (newRoom && newArea) {
      const updatedLocations = [...savedLocations];
      updatedLocations[index] = { ...updatedLocations[index], room: newRoom, area: newArea };
      setSavedLocations(updatedLocations);
      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
    }
  };

  return (
    <div className="locations-page">
      <h1>My Locations</h1>
      <div className="saved-locations-section">
        <h2>Saved Locations</h2>
        {savedLocations.length > 0 ? (
          <ul>
            {savedLocations.map((location, index) => (
              <li key={index} className="location-item">
                <span className={`tag ${location.tag.toLowerCase()}`}>
                  {location.tag === "Home" && <FontAwesomeIcon icon={faHome} />}
                  {location.tag === "Office" && <FontAwesomeIcon icon={faBriefcase} />}
                  {location.tag === "Family" && <FontAwesomeIcon icon={faUsers} />}
                  {" "}{location.tag}
                </span>
                <div className="location-details">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                  <p>{location.room}</p>
                  <p>{location.area}</p>
                </div>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleUpdateLocation(index)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteLocation(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved locations yet.</p>
        )}
      </div>
      <div className="recent-searches-section">
        <h2>Recent Searches</h2>
        {recentSearches.length > 0 ? (
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index} className="recent-search-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="search-icon" /> {search}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent searches found.</p>
        )}
      </div>
    </div>
  );
};

export default LocationsPage;
