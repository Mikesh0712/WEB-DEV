const path = require('path');

exports.diagnoseImage = async (req, res) => {
  try {
    const imagePath = path.join(__dirname, '..', req.file.path);
    console.log('🖼️ Image received at:', imagePath);

    // Simulated ML-like response
    const fakeResult = {
      predictions: [
        { disease: "Early Blight", confidence: 78 },
        { disease: "Leaf Spot", confidence: 15 },
        { disease: "Healthy", confidence: 7 }
      ],
      recommendedRemedy: "Use organic fungicide like neem oil. Avoid overhead watering."
    };

    res.json({ success: true, data: fakeResult });
  } catch (err) {
    console.error("❌ Error diagnosing image:", err);
    res.status(500).json({ success: false, message: "Failed to diagnose." });
  }
};
