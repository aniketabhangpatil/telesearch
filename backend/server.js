import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { ensureUploadDir } from './middleware/uploadMiddleware.js';

import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import sponsoredRoutes from './routes/sponsored.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies (essential for secure cookies on Vercel, Render, Railway, Heroku)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allow inline scripts/assets for local dev
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/$/, '')] : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Dev mode flexible
  },
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General Rate Limiter
app.use('/api', apiLimiter);

// Session Configuration (Secure HTTP-only session)
app.use(session({
  name: process.env.SESSION_NAME || 'tcf_sid',
  secret: process.env.SESSION_SECRET || 'tcf_super_secure_session_secret_2026_xyz',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static uploads serving (compatible with local development and Vercel temporary storage)
const uploadDirectory = ensureUploadDir();
app.use('/uploads', express.static(uploadDirectory));

// Fallback to local uploads directory if distinct from uploadDirectory
const localUploadsDir = path.join(__dirname, 'uploads');
if (localUploadsDir !== uploadDirectory && fs.existsSync(localUploadsDir)) {
  app.use('/uploads', express.static(localUploadsDir));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/sponsored', sponsoredRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint (shows DB connectivity status)
app.get('/api/health', async (req, res) => {
  const dbOk = await testConnection();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'online' : 'degraded',
    db: dbOk ? 'connected' : 'unreachable',
    db_host: process.env.DB_HOST || 'localhost',
    db_port: process.env.DB_PORT || '3306',
    db_name: process.env.DB_NAME || 'telegram_channel_finder',
    db_ssl: process.env.DB_SSL || 'false',
    timestamp: new Date().toISOString(),
    service: 'Telegram Channel Finder API'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Server (only when not running as a Vercel serverless function)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`🚀 Telegram Channel Finder Backend listening on port ${PORT}`);
    console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    await testConnection();
  });
}

export default app;

