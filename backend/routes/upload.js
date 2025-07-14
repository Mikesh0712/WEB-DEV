const express = require('express');
const router = express.Router();
const multer = require('multer');
const { diagnoseImage } = require('../controllers/diagnoseController');

// Set up Multer to store uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route: POST /api/upload
router.post('/', upload.single('image'), diagnoseImage);

module.exports = router;
