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
import { initializeScheduler } from './lib/scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
