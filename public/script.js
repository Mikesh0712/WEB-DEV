// 🌗 Theme Toggle
document.getElementById("themeSwitch").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode", this.checked);
});

// 🌐 Language Switcher
document.getElementById("langSelect").addEventListener("change", function () {
  const lang = this.value;

  if (lang === "hi") {
    document.querySelector("h1").innerText = "पौधों की बीमारियों का पता लगाएं";
    document.querySelector(".hero-content p").innerText = "AI द्वारा संचालित फसल हेल्थ चेक";
    document.querySelector(".cta-button").innerText = "पता लगाएं";
    document.getElementById("upload").querySelector("h2").innerText = "फसल पत्ता अपलोड करें";
    document.querySelector("#upload p").innerText = "बीमारी की जानकारी के लिए अपनी फसल की फोटो अपलोड करें";
  } else {
    document.querySelector("h1").innerText = "Detect Plant Diseases Instantly";
    document.querySelector(".hero-content p").innerText = "Empowering farmers with AI-based crop health diagnosis";
    document.querySelector(".cta-button").innerText = "Detect Now";
    document.getElementById("upload").querySelector("h2").innerText = "Upload Your Crop Leaf";
    document.querySelector("#upload p").innerText = "Select or take a photo of your crop to get diagnosis instantly";
  }
});

// 📤 Upload Logic (Mock for now)
function uploadImage() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  if (!file) {
    alert("Please select an image to upload.");
    return;
  }

  const resultBox = document.getElementById("result");
  resultBox.innerHTML = "<p>🔍 Analyzing image...</p>";

  setTimeout(() => {
    resultBox.innerHTML = `
      <h3>Diagnosis Result:</h3>
      <p><strong>Tomato – Early Blight</strong></p>
      <p>Recommendation: Use organic fungicide and avoid overhead watering.</p>
    `;
  }, 2000);
}
