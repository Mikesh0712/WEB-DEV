import { auth, db } from './app.js';
import { collection, addDoc, getDocs, updateDoc, doc, increment, query, orderBy, limit } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const postBtn = document.getElementById('post-btn');
const postContent = document.getElementById('post-content');
const allPostsContainer = document.getElementById('all-posts');
const topPostsContainer = document.getElementById('top-posts');

// ✅ Sample Posts for Hackathon Demo
const samplePosts = [
  { content: "Stay safe! Share your location with trusted contacts.", likes: 12 },
  { content: "I found an amazing free self-defense course on Coursera!", likes: 8 },
  { content: "Anyone knows good scholarship programs for women in tech?", likes: 15 }
];

// ✅ Load posts on page load
loadPosts();

// ✅ Add Post
postBtn.addEventListener('click', async () => {
  const content = postContent.value.trim();
  if (!content) {
    alert("Please write something!");
    return;
  }

  try {
    await addDoc(collection(db, "forumPosts"), {
      content,
      likes: 0,
      timestamp: new Date()
    });
    postContent.value = "";
    loadPosts();
  } catch (error) {
    console.error(error);
    alert("Error posting");
  }
});

// ✅ Load Posts (Firestore + Sample)
async function loadPosts() {
  allPostsContainer.innerHTML = "";
  topPostsContainer.innerHTML = "";

  // Load Firestore posts
  const qRecent = query(collection(db, "forumPosts"), orderBy("timestamp", "desc"));
  const qTop = query(collection(db, "forumPosts"), orderBy("likes", "desc"), limit(3));

  const recentSnapshot = await getDocs(qRecent);
  const topSnapshot = await getDocs(qTop);

  // ✅ Add sample posts to "Top Posts"
  samplePosts.sort((a, b) => b.likes - a.likes).slice(0, 3).forEach(post => {
    createPostCard(null, post, topPostsContainer, false);
  });

  // ✅ Firestore Top Posts
  topSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    createPostCard(docSnap.id, data, topPostsContainer, true);
  });

  // ✅ Add sample posts to "Recent Posts"
  samplePosts.forEach(post => {
    createPostCard(null, post, allPostsContainer, false);
  });

  // ✅ Firestore Recent Posts
  recentSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    createPostCard(docSnap.id, data, allPostsContainer, true);
  });
}

// ✅ Create Post Card
function createPostCard(id, data, container, isFirestore) {
  const card = document.createElement('div');
  card.classList.add('post-card');

  card.innerHTML = `
    <p>${data.content}</p>
    <div class="post-actions">
      <span>${data.likes} Likes</span>
      ${isFirestore ? `<button class="like-btn" data-id="${id}">❤️ Like</button>` : ""}
    </div>
  `;

  container.appendChild(card);

  if (isFirestore) {
    card.querySelector('.like-btn').addEventListener('click', async () => {
      const postRef = doc(db, "forumPosts", id);
      await updateDoc(postRef, { likes: increment(1) });
      loadPosts();
    });
  }
}
