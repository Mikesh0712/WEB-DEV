import { auth, db } from './app.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const usernameEl = document.getElementById('username');
const emailEl = document.getElementById('user-email');
const contactsList = document.getElementById('contacts-list');
const addBtn = document.getElementById('add-contact-btn');
const avatarUpload = document.getElementById('avatar-upload');
const avatarImg = document.getElementById('avatar');
const authBtn = document.getElementById('auth-btn');
const postsList = document.getElementById('posts-list'); // New for user's posts

const storage = getStorage();
let userUID = null;

// Check Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userUID = user.uid;
    usernameEl.textContent = `Welcome, ${user.email.split('@')[0]}`;
    emailEl.textContent = user.email;
    authBtn.textContent = "Logout";

    authBtn.addEventListener('click', () => {
      signOut(auth).then(() => window.location.href = "login.html");
    });

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const contacts = data.emergencyContacts || [];
      displayContacts(contacts);
      if (data.avatarURL) avatarImg.src = data.avatarURL;
    }

    loadUserPosts();
  } else {
    window.location.href = "login.html";
  }
});

// Add Emergency Contact
addBtn.addEventListener('click', async () => {
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const user = auth.currentUser;

  if (!name || !phone) {
    alert("Please enter both name and phone.");
    return;
  }

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    let contacts = [];

    if (userSnap.exists()) {
      contacts = userSnap.data().emergencyContacts || [];
    }

    contacts.push({ name, phone });
    await updateDoc(userRef, { emergencyContacts: contacts }).catch(async () => {
      await setDoc(userRef, { emergencyContacts: [{ name, phone }] });
    });

    displayContacts(contacts);
    document.getElementById('contact-name').value = "";
    document.getElementById('contact-phone').value = "";
  }
});

// Display Contacts with Delete Button
function displayContacts(contacts) {
  contactsList.innerHTML = "";
  contacts.forEach((c, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${c.name} - ${c.phone}
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    contactsList.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = e.target.getAttribute('data-index');
      contacts.splice(index, 1);
      await updateDoc(doc(db, "users", userUID), { emergencyContacts: contacts });
      displayContacts(contacts);
    });
  });
}

// Avatar Upload
avatarUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) return;

  const avatarRef = ref(storage, `avatars/${user.uid}`);
  await uploadBytes(avatarRef, file);
  const downloadURL = await getDownloadURL(avatarRef);

  avatarImg.src = downloadURL;

  await updateDoc(doc(db, "users", user.uid), { avatarURL: downloadURL }).catch(async () => {
    await setDoc(doc(db, "users", user.uid), { avatarURL: downloadURL });
  });

  alert("Profile picture updated!");
});

// Load User's Forum Posts
async function loadUserPosts() {
  if (!postsList) return;
  postsList.innerHTML = "<li>Loading your posts...</li>";

  const q = query(collection(db, "forumPosts"), where("userUID", "==", userUID));
  const snapshot = await getDocs(q);

  postsList.innerHTML = "";
  if (snapshot.empty) {
    postsList.innerHTML = "<li>No posts yet</li>";
  } else {
    snapshot.forEach(docSnap => {
      const post = docSnap.data();
      const li = document.createElement('li');
      li.textContent = post.content || "Untitled Post";
      postsList.appendChild(li);
    });
  }
}
