import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from './middleware/auth.js';
import organizationRoutes from './routes/organizations.js';
import transactionRoutes from './routes/transactions.js';
import memberRoutes from './routes/members.js';
import invitationRoutes from './routes/invitations.js';
import recurringTransactionRoutes from './routes/recurringTransactions.js';
import budgetRoutes from './routes/budgets.js';
import { initializeScheduler } from './lib/scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`✓ API server running on http://localhost:${PORT}`);

  // Initialize scheduled tasks
  initializeScheduler();
});
