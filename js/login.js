import { auth } from './app.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const formTitle = document.getElementById('form-title');
const authBtn = document.getElementById('auth-btn');
const toggleLink = document.getElementById('toggle-link');

let isLogin = true; // Default state

toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  authBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleLink.textContent = isLogin ? "Sign Up" : "Login";
});

authBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isLogin) {
    // Login
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Logged in successfully!");
        window.location.href = 'index.html';
      })
      .catch(err => alert(err.message));
  } else {
    // Sign Up
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => alert("Account created! Please login."))
      .catch(err => alert(err.message));
  }
});
