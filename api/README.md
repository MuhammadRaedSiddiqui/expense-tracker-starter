# API Documentation

This directory contains Vercel serverless functions that serve as the backend API.

## Structure

```
api/
├── health.js              # Health check endpoint
├── auth/                  # Authentication endpoints (Phase 1)
├── transactions/          # Transaction CRUD endpoints (Phase 1)
├── organizations/         # Organization management (Phase 2)
└── webhooks/             # Webhook handlers (Phase 3)
```

## Endpoints

### Health Check
- **GET** `/api/health`
- Returns API status and version
- No authentication required

### Coming Soon (Phase 1)
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/transactions` - List transactions
- **POST** `/api/transactions` - Create transaction
- **PUT** `/api/transactions/:id` - Update transaction
- **DELETE** `/api/transactions/:id` - Delete transaction

## Development

Vercel serverless functions are automatically deployed when you push to GitHub.

For local development:
```bash
npm install -g vercel
vercel dev
```

## Environment Variables

All API endpoints have access to environment variables defined in Vercel or `.env.local`.

Required variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key (for server-side)
- `CLERK_SECRET_KEY` - Clerk secret key
- `STRIPE_SECRET_KEY` - Stripe secret key

## Authentication

All endpoints (except `/api/health`) will require authentication via Clerk.

Example:
```javascript
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Your endpoint logic here
}
```

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Internal server error
