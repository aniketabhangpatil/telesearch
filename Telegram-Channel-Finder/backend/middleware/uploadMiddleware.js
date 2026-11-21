import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, sanitizedName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext) && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image files (.png, .jpg, .jpeg, .webp, .svg) are allowed.'), false);
  }
};

export const uploadLogo = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB limit
  },
  fileFilter
});

