const path = require('path');
const fs = require('fs');
const connection = require('../db');

exports.uploadMedia = (req, res) => {
  const { file } = req;
  const { userId } = req.body;

  const mediaPath = path.join(__dirname, '..', 'uploads', file.filename);

  connection.query(
    'INSERT INTO media (user_id, media_path) VALUES (?, ?)',
    [userId, mediaPath],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: 'Media uploaded successfully' });
    }
  );
};

exports.getMedia = (req, res) => {
  const { userId } = req.params;

  connection.query(
    'SELECT * FROM media WHERE user_id = ?',
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ media: results });
    }
  );
};

exports.deleteMedia = (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT media_path FROM media WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const mediaPath = results[0].media_path;

      fs.unlink(mediaPath, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        connection.query(
          'DELETE FROM media WHERE id = ?',
          [id],
          (deleteError) => {
            if (deleteError) {
              return res.status(500).json({ error: deleteError.message });
            }
            res.status(200).json({ message: 'Media deleted successfully' });
          }
        );
      });
    }
  );
};
