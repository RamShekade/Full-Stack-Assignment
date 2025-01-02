// import React from "react";
// import MapComponent from "./map";

// function App() {
//   return (
//     <div>
//       <h1>Google Maps in React</h1>
//       <MapComponent />
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MapComponent from "./map"; 
import LocationsPage from "./location";
import "./App.css";

function HomePage({ setShowModal }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState("Fetching location...");
  const [showLocationPrompt, setShowLocationPrompt] = useState(true); // New state for showing the prompt

  useEffect(() => {
    const fetchLocationName = async (lat, lng) => {
      const myAPIKey = "150e06eddfae4eae8238262a611a61d7";
      const geocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${myAPIKey}`;

      try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setLocationName(data.features[0].properties.formatted);
        } else {
          setLocationName("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
        setLocationName("Error fetching location");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationName("Unable to fetch location");
          setShowLocationPrompt(true); // Show location prompt
        }
      );
    } else {
      setLocationName("Geolocation not supported by your browser");
      setShowLocationPrompt(true); // Show location prompt
    }
  }, []);

  return (
    <div className="App">
      <div className="location-section">
        <header className="location-header">
          <h2>Your Current Location</h2>
          <p>{locationName}</p>
        </header>
      </div>

      <header className="App-header">
        <h1>Welcome to Food Delivery</h1>
      </header>

      <div className="cards-section">
        {[1, 2, 3].map((card) => (
          <div key={card} className="card">
            <img
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9hPhtTXVihIPv8tSlzqNxJj-hrxetU6A03Q&s`}
              alt={`Food Item ${card}`}
              className="card-image"
            />
            <h3 className="card-title">Food Item {card}</h3>
            <Link to="/map">
              <button className="order-now-card">Order Now</button>
            </Link>
          </div>
        ))}
      </div>

      <div className="slider">
        <div className="slide">Fresh Food Delivered to Your Doorstep!</div>
        <div className="slide">Fast and Reliable Service!</div>
      </div>

      <footer className="App-footer">
        <p>&copy; 2024 Food Delivery. All rights reserved.</p>
      </footer>

      {/* Location Permission Notification */}
      {showLocationPrompt && (
        <div className="location-prompt">
          <p>We need your location to show the nearest delivery options.</p>
          <button onClick={() => requestLocationPermission(setShowLocationPrompt)}>Enable Location</button>
        </div>
      )}
    </div>
  );
}

function requestLocationPermission(setShowLocationPrompt) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        setShowLocationPrompt(false); // Hide prompt after success
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Please enable location services in your browser.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage setShowModal={setShowModal} />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/locations" element={<LocationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
