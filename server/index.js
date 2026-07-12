import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware } from './middleware/auth.js';
import organizationRoutes from './routes/organizations.js';
import transactionRoutes from './routes/transactions.js';
import memberRoutes from './routes/members.js';
import invitationRoutes from './routes/invitations.js';
import recurringTransactionRoutes from './routes/recurringTransactions.js';
import budgetRoutes from './routes/budgets.js';
import { initializeScheduler } from './lib/scheduler.js';
import { logger } from './lib/logger.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// API Documentation (dev only)
if (process.env.NODE_ENV !== 'production') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const openapiSpec = JSON.parse(readFileSync(join(__dirname, 'docs', 'openapi.json'), 'utf-8'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'Finance Tracker API Docs',
  }));
}

// Health check - first, before any middleware
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Security headers
// CORS configuration - must be before helmet and other middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ipKeyGenerator: false },
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limiting for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many write requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip,
  validate: { ipKeyGenerator: false },
});

app.use(express.json({ limit: '16kb' }));

// Apply write limiter to POST/PUT/DELETE
app.use('/api/', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// Protected routes
app.use('/api/organizations', clerkMiddleware, organizationRoutes);
app.use('/api/transactions', clerkMiddleware, transactionRoutes);
app.use('/api/members', clerkMiddleware, memberRoutes);
app.use('/api/invitations', clerkMiddleware, invitationRoutes);
app.use('/api/recurring-transactions', clerkMiddleware, recurringTransactionRoutes);
app.use('/api/budgets', clerkMiddleware, budgetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  logger.info(`✓ API server running on http://localhost:${PORT}`);

  // Initialize scheduled tasks
  initializeScheduler();
});
