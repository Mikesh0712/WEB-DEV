// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLBY9cTYiEuzRVodJgwHbD1J7VNEmMUGI",
  authDomain: "women-safety-fa8cd.firebaseapp.com",
  projectId: "women-safety-fa8cd",
  storageBucket: "women-safety-fa8cd.firebasestorage.app",
  messagingSenderId: "303193573261",
  appId: "1:303193573261:web:41cb02e8646cd0d61b5fc4",
  measurementId: "G-SZGCQKCCZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Check login state globally
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Logged in as:", user.email);
  } else {
    console.log("No user logged in");
  }
});
