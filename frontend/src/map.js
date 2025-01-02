// import React from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// // Define map container style
// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// // Set initial center coordinates
// const center = {
//   lat: 20.5937, // Latitude
//   lng: 78.9629, // Longitude
// };

// function MapComponent() {
//   return (
//     <LoadScript googleMapsApiKey="AIzaSyAXMJzR77i8gq0XAqIn-15rHHuyVfgSqSs&parameters">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={8}
//       >
//         {/* Add a marker */}
//         <Marker position={center} />
//       </GoogleMap>
//     </LoadScript>
//   );
// }

// export default MapComponent;
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./map.css";
import { useNavigate } from "react-router-dom";

// Map container styling
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};

const centerStart = {
  lat: 20.5937,
  lng: 78.9629,
};

function MapComponent() {
  const [center, setCenter] = useState(centerStart);
  const [markerPosition, setMarkerPosition] = useState(centerStart);
  const [inputValue, setInputValue] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    room: "",
    area: "",
  });

  const navigate = useNavigate();

  const handlePlaceChanged = async (input) => {
    const myAPIKey = "150e06eddfae4eae8238262a611a61d7";
    if (!input || input.length < 3) {
      console.log("The address string is too short. Enter at least three symbols");
      return;
    }

    const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(input)}&apiKey=${myAPIKey}`;

    await fetch(geocodingUrl)
      .then((result) => result.json())
      .then((featureCollection) => {
        const coordinates = featureCollection.features[0].geometry.coordinates;
        const lng = coordinates[0];
        const lat = coordinates[1];
        setMarkerPosition({ lat, lng });
        setCenter({ lat, lng });
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleAddressSubmit = async(e) => {
    e.preventDefault();
    console.log("Final Address Details:", { ...addressDetails, location: markerPosition });
    const dataToSend = {
      ...addressDetails,
      location: markerPosition,
    };
  
    try {
      // Replace the URL with your actual API endpoint
      const response = await fetch("https://your-api-endpoint.com/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Data saved successfully:", responseData);
        alert("Address saved successfully!");
        navigate("/locations"); // Navigate to another page after successful submission
      } else {
        console.error("Error saving data:", response.statusText);
        alert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred during API request:", error);
      alert("An error occurred. Please check your connection and try again.");
    }

    alert("Address saved successfully!");
    navigate("/locations");


  };

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey="AIzaSyAXMJzR77i8gq0XAqIn-15rHHuyVfgSqSs">
        {/* Search and Locate Me Buttons */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a location"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePlaceChanged(inputValue);
              }
            }}
            className="location-input"
          />
          <button onClick={handleLocateMe} className="locate-me-button">
            Locate Me
          </button>
        </div>

        {/* Map Component */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          onClick={(e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });
          }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setMarkerPosition({ lat, lng });
            }}
          />
        </GoogleMap>

        {/* Confirm Location Button */}
        <div className="continue-container">
          {!locationConfirmed && (
            <button
              onClick={() => setLocationConfirmed(true)}
              className="continue-button"
            >
              Confirm Location
            </button>
          )}
        </div>
      </LoadScript>

      {/* Address Form */}
           {/* Address Form */}
           {locationConfirmed && (
        <form onSubmit={handleAddressSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="room">Room/Floor/Building</label>
            <input
              type="text"
              id="room"
              value={addressDetails.room}
              onChange={(e) => setAddressDetails({ ...addressDetails, room: e.target.value })}
              placeholder="Enter room, floor, or building details"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="area">Area/Nearby</label>
            <input
              type="text"
              id="area"
              value={addressDetails.area}
              onChange={(e) => setAddressDetails({ ...addressDetails, area: e.target.value })}
              placeholder="Enter area or nearby landmarks"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="locationType">Location Type</label>
            <select
              id="locationType"
              value={addressDetails.locationType}
              onChange={(e) => setAddressDetails({ ...addressDetails, locationType: e.target.value })}
              required
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Save Address
          </button>
        </form>
      )}

    </div>
  );
}

export default MapComponent;
