import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determine a Vercel-compatible writable uploads directory.
 * On Vercel (AWS Lambda), the root filesystem (/var/task) is strictly read-only.
 * The only writable filesystem location in the serverless runtime is `/tmp`.
 */
export const getUploadDir = () => {
  // Check for Vercel or Lambda serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION) {
    return path.join('/tmp', 'telesearch-uploads');
  }

  // Allow explicit override via environment variable if provided
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }

  // On Windows/local development, prefer local directory relative to project root
  if (process.platform === 'win32') {
    return path.join(__dirname, '..', 'uploads');
  }

  // Default Linux/serverless fallback
  return path.join('/tmp', 'telesearch-uploads');
};

/**
 * Safely ensure the upload directory exists without throwing ENOENT/EROFS
 */
export const ensureUploadDir = () => {
  const targetDir = getUploadDir();

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  } catch (err) {
    // If targetDir failed (e.g. permission or platform constraint), fallback to os.tmpdir()
    const osTempSubdir = path.join(os.tmpdir(), 'telesearch-uploads');
    try {
      if (!fs.existsSync(osTempSubdir)) {
        fs.mkdirSync(osTempSubdir, { recursive: true });
      }
      return osTempSubdir;
    } catch (fallbackErr) {
      // Last resort: root of system temporary directory
      return os.tmpdir();
    }
  }
};

// Initialize upload directory safely
const uploadDir = ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensureUploadDir();
    cb(null, dir);
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
