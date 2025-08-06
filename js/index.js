import { auth, db } from './app.js';
import { getDoc, doc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let map, userMarker, userLocation;

// Initialize Map
function initMap(lat, lng) {
  userLocation = { lat, lng };
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 15
  });

  userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    title: "You are here"
  });
}

// Real-time Location Tracking
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (!map) {
      initMap(lat, lng);
    } else {
      userLocation = { lat, lng };
      userMarker.setPosition(userLocation);
    }
  }, () => {
    alert("Unable to retrieve your location");
  });
} else {
  alert("Geolocation is not supported by your browser.");
}

// SOS Logic
document.getElementById('sos-btn').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to use SOS!");
    return;
  }

  if (!userLocation) {
    alert("Location not available yet");
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const contacts = (userDoc.data()?.emergencyContacts || []).slice(0, 3).map(c => c.phone);
  contacts.push("112");

  if (contacts.length === 0) {
    alert("No emergency contacts found");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/send-sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts, location: userLocation })
    });
    const data = await response.json();

    if (data.success) {
      alert("SOS sent successfully!");
      await addDoc(collection(db, "sosLogs"), {
        userUID: user.uid,
        timestamp: serverTimestamp(),
        location: userLocation
      });
    } else {
      alert("Failed to send SOS");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending SOS");
  }
});
