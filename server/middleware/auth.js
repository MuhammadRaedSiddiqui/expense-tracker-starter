import { verifyToken } from '@clerk/clerk-sdk-node';
import { logger } from '../lib/logger.js';

export async function clerkMiddleware(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user ID to request (sub claim contains the user ID)
    req.userId = payload.sub;

    next();
  } catch (error) {
    logger.error('Auth middleware error', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
