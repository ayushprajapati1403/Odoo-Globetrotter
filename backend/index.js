import axios from 'axios';

// Your Google API key
const API_KEY = 'YOUR_API_KEY'; // replace with your Google API key

// Step 1 — Get city coordinates
async function getCityCoordinates(cityName) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${API_KEY}`;
  const res = await axios.get(url);

  if (res.data.results.length > 0) {
    const location = res.data.results[0].geometry.location;
    console.log(`Coordinates for ${cityName}:`, location);
    return location; // { lat: ..., lng: ... }
  } else {
    throw new Error('City not found');
  }
}

// Step 2 — Get nearby hotels
async function getNearbyHotels(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lodging&key=${API_KEY}`;
  const res = await axios.get(url);

  console.log('\nNearby Hotels:');
  res.data.results.forEach(hotel => {
    console.log(`- ${hotel.name} | Rating: ${hotel.rating || 'N/A'}`);
  });
}

// Step 3 — Get nearby activities
async function getNearbyActivities(lat, lng) {
  const activityTypes = ['tourist_attraction', 'museum', 'park'];

  console.log('\nNearby Activities:');
  for (const type of activityTypes) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${API_KEY}`;
    const res = await axios.get(url);

    console.log(`\nType: ${type}`);
    res.data.results.forEach(place => {
      console.log(`- ${place.name} | Rating: ${place.rating || 'N/A'}`);
    });
  }
}

// Main test function
async function main() {
  try {
    const cityName = 'Ahmedabad'; // change as needed
    const { lat, lng } = await getCityCoordinates(cityName);
    await getNearbyHotels(lat, lng);
    await getNearbyActivities(lat, lng);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
