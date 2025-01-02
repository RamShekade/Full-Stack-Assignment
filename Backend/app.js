const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Locations', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Address Schema
const addressSchema = new mongoose.Schema({
  name: String,
  address: String,
  coordinates: { lat: Number, lng: Number },
});

// Create Address Model
const Address = mongoose.model('Address', addressSchema);

// POST endpoint to save location
app.post('/locations', async (req, res) => {
  try {
    const { room, area, locationType, location } = req.body;

    if (!room || !area || !locationType || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prepare the new location
    const newLocation = {
      room,
      area,
      locationType,
      location,
      createdAt: new Date(),
    };

    // Use the Address model to insert the new location
    const result = await Address.create(newLocation);
    res.status(201).json({ message: "Location saved successfully!", data: result });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Error saving location" });
  }
});

// GET endpoint to fetch addresses
app.get('/addresses', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
