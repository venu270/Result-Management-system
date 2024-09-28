import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage });

export default upload;
