const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());

const { register, login, allUsers } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the destination directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get('/getalluser',authMiddleware,allUsers)
app.post('/register', upload.single('image'), register);

app.post('/login', login);

module.exports = app;
