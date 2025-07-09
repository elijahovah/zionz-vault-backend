const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.send('🎧 Zionz Vault backend is live and listening.');
});

// File upload route
app.post('/upload', upload.single('track'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const metadata = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    title: req.body.title || 'Untitled',
    artist: req.body.artist || 'Unknown',
    tags: req.body.tags || [],
  };

  // Log and confirm receipt
  console.log('File uploaded:', metadata);
  res.status(200).json({ message: 'Upload successful', metadata });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
