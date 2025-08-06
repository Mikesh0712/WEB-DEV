import { auth, db } from './app.js';
import { doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Bookmark Feature
document.querySelectorAll('.bookmark').forEach((icon, index) => {
  icon.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Login to save bookmarks!");
      return;
    }

    icon.classList.toggle('active');
    const title = icon.closest('.card').querySelector('h3').innerText;
    const link = icon.closest('.card').querySelector('a').href;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          savedResources: arrayUnion({ title, link })
        });
        alert("Saved to bookmarks!");
      }
    } catch (err) {
      console.error(err);
    }
  });
});

// Filter & Search
const searchInput = document.getElementById('searchInput');
const buttons = document.querySelectorAll('.filter-buttons button');
const cards = document.querySelectorAll('.card, .tip-card, .law-card');

searchInput.addEventListener('input', () => {
  filterResources();
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterResources();
  });
});

function filterResources() {
  const query = searchInput.value.toLowerCase();
  const category = document.querySelector('.filter-buttons button.active').dataset.category;

  cards.forEach(card => {
    const title = card.querySelector('h3, h4') ? card.querySelector('h3, h4').innerText.toLowerCase() : "";
    const matchesSearch = title.includes(query);
    const matchesCategory = category === 'all' || card.dataset.category === category;

    card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
  });
}
