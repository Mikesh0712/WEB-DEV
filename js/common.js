// js/common.js
import { auth, db } from './app.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let userLocation = null;

// ✅ Track user location globally
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(position => {
    userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }, () => {
    console.warn("Unable to retrieve location.");
  });
}

// ✅ Navbar: Show username & toggle Login/Logout button
onAuthStateChanged(auth, user => {
  const greeting = document.getElementById('user-greeting');
  if (greeting) {
    greeting.textContent = user ? `Welcome, ${user.email.split('@')[0]}!` : "Welcome!";
  }

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    if (user) {
      loginBtn.textContent = "Logout";
      loginBtn.onclick = () => {
        signOut(auth).then(() => window.location.href = "index.html");
      };
    } else {
      loginBtn.textContent = "Login";
      loginBtn.onclick = () => window.location.href = "login.html";
    }
  }
});

// ✅ Google Translate Widget
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}
window.googleTranslateElementInit = googleTranslateElementInit;

// ✅ Global SOS Button Logic
const sosBtn = document.getElementById('sos-btn');
if (sosBtn) {
  sosBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to use SOS!");
      return;
    }

    if (!userLocation) {
      alert("Location not available yet. Please allow location access.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const contacts = (userDoc.data()?.emergencyContacts || []).slice(0, 3).map(c => c.phone);
      contacts.push("112"); // Add emergency helpline

      if (contacts.length === 0) {
        alert("No emergency contacts found in your profile!");
        return;
      }

      // Send SOS via backend (SMS / WhatsApp / Email)
      const response = await fetch('http://localhost:5000/send-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts,
          location: userLocation,
          userEmail: user.email
        })
      });

      const data = await response.json();
      if (data.success) {
        alert("🚨 SOS alert sent successfully to your contacts and 112!");
        
        // Log SOS in Firestore
        await addDoc(collection(db, "sosLogs"), {
          userUID: user.uid,
          timestamp: serverTimestamp(),
          location: userLocation
        });
      } else {
        alert("Failed to send SOS. Try again!");
      }
    } catch (err) {
      console.error(err);
      alert("Error while sending SOS");
    }
  });
}
