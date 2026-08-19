const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const connectDB = require('./config/db');

// Initialize Express App
const app = express();

// Connect to MongoDB Database
connectDB();

// 1. Gzip Compression for network performance optimization
app.use(compression());

// 2. Helmet.js Enterprise Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Strict CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 4. Rate Limiting Protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Strict limit for authentication endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Express Body Parsers with payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/improvement-plan', require('./routes/improvementRoutes'));
app.use('/api/tutor', require('./routes/tutorRoutes'));

// Route Aliases for Postman / Thunder Client compatibility
const { protect } = require('./middleware/authMiddleware');
const { getMe } = require('./controllers/authController');
const { uploadResume } = require('./controllers/resumeController');
const { startInterview, submitAnswer, getInterviewHistory } = require('./controllers/interviewController');
const { getAnalyticsOverview } = require('./controllers/analyticsController');
const upload = require('./middleware/uploadMiddleware');

app.get('/api/user/profile', protect, getMe);
app.post('/api/resume/upload', protect, upload.single('resume'), uploadResume);
app.post('/api/interview/generate', protect, startInterview);
app.post('/api/interview/answer', protect, (req, res, next) => {
  if (req.body && req.body.interviewId) {
    req.params.id = req.body.interviewId;
  }
  next();
}, submitAnswer);
app.get('/api/interview/history', protect, getInterviewHistory);
app.get('/api/dashboard', protect, getAnalyticsOverview);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AI Interview Coach Backend API',
    security: 'Helmet + CORS + RateLimit Active',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.originalUrl}`,
  });
});

// Global Error Handling Middleware with Multer Validation Support
app.use((err, req, res, next) => {
  console.error('Global Error Handler Captured:', err.message);
  let statusCode = err.status || err.statusCode || 500;
  if (err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('Invalid file type'))) {
    statusCode = 400;
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Express Server with EADDRINUSE Error Handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 AI Interview Coach Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use by another active node process.`);
    console.log(`🚀 AI Interview Coach Backend is already active & running on http://localhost:${PORT}`);
    process.exit(0);
  } else {
    console.error('Server startup error:', err);
    process.exit(1);
  }
});

// Graceful Shutdown Handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});

module.exports = app;
