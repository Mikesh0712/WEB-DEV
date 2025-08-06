import { auth, db } from './app.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } 
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const usernameEl = document.getElementById('username');
const emailEl = document.getElementById('user-email');
const contactsList = document.getElementById('contacts-list');
const addBtn = document.getElementById('add-contact-btn');
const avatarUpload = document.getElementById('avatar-upload');
const avatarImg = document.getElementById('avatar');
const authBtn = document.getElementById('auth-btn');

const storage = getStorage();

onAuthStateChanged(auth, async user => {
  if (user) {
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
    await updateDoc(userRef, {
      emergencyContacts: arrayUnion({ name, phone })
    }).catch(async () => {
      await setDoc(userRef, { emergencyContacts: [{ name, phone }] });
    });

    displayContacts([{ name, phone }], true);
    document.getElementById('contact-name').value = "";
    document.getElementById('contact-phone').value = "";
  }
});

function displayContacts(contacts, append = false) {
  if (!append) contactsList.innerHTML = "";
  contacts.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} - ${c.phone}`;
    contactsList.appendChild(li);
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
