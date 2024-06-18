// backend/routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const connection = require('../config.js');
const { uploadMedia, getMedia, deleteMedia } = require('../controllers/media');

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends the extension of the original file
  }
});

const upload = multer({ storage: storage });

// Upload Media
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    const { userId, fileType } = req.body;
    const filePath = req.file.path;
    const query = 'INSERT INTO media (userId, filePath, fileType) VALUES (?, ?, ?)';
    connection.query(query, [userId, filePath, fileType], (err, result) => {
      if (err) {
        console.error('Error uploading media:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      res.status(201).json({ message: 'Media uploaded successfully', media: result });
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User Media
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = 'SELECT * FROM media WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user media:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      res.status(200).json({ media: results });
    });
  } catch (error) {
    console.error('Error fetching user media:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Media
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM media WHERE id = ?';
    connection.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting media:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      res.status(200).json({ message: 'Media deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
