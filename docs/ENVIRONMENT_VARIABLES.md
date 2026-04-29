# Environment Variables Reference

Complete reference for all environment variables used in the expense tracker application.

## Frontend Environment Variables

All frontend environment variables must be prefixed with `VITE_` to be accessible in the browser.

Create `.env` in the project root:

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public API key | `pk_test_xxx` | Clerk Dashboard → API Keys |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` | Your backend URL |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJxxx` | Supabase Dashboard → Settings → API |

### Optional Variables

| Variable | Description | Default | Where to Get |
|----------|-------------|---------|--------------|
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | - | Sentry Dashboard → Settings → Client Keys |
| `VITE_SENTRY_ENVIRONMENT` | Environment name for Sentry | `development` | Custom value |
| `VITE_POSTHOG_KEY` | PostHog analytics key | - | PostHog Dashboard → Project Settings |
| `VITE_POSTHOG_HOST` | PostHog API host | `https://app.posthog.com` | PostHog Dashboard |

### Example `.env` File

```bash
# Required
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZXhhbXBsZS5jb20k
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjQyMjQwMCwiZXhwIjoxOTU3OTk4NDAwfQ.example

# Optional
VITE_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
VITE_SENTRY_ENVIRONMENT=development
VITE_POSTHOG_KEY=phc_abcdefghijklmnopqrstuvwxyz123456
VITE_POSTHOG_HOST=https://app.posthog.com
```

---

## Backend Environment Variables

Create `server/.env`:

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `PORT` | Server port | `3001` | Custom value |
| `CLERK_SECRET_KEY` | Clerk secret API key | `sk_test_YOUR_CLERK_SECRET_KEY_HERE` | Clerk Dashboard → API Keys |
| `CLERK_PUBLISHABLE_KEY` | Clerk public API key | `pk_test_xxx` | Clerk Dashboard → API Keys |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJxxx` | Supabase Dashboard → Settings → API (Reveal) |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:...` | Supabase Dashboard → Settings → Database |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Your frontend URL |

### Optional Variables

| Variable | Description | Default | Where to Get |
|----------|-------------|---------|--------------|
| `NODE_ENV` | Environment mode | `development` | `development` or `production` |
| `RESEND_API_KEY` | Resend email API key | - | Resend Dashboard → API Keys |
| `FROM_EMAIL` | Email sender address | - | Your verified domain in Resend |
| `SENTRY_DSN` | Sentry error tracking DSN | - | Sentry Dashboard → Settings → Client Keys |
| `SENTRY_ENVIRONMENT` | Environment name for Sentry | `development` | Custom value |
| `POSTHOG_API_KEY` | PostHog analytics key | - | PostHog Dashboard → Project Settings |
| `POSTHOG_HOST` | PostHog API host | `https://app.posthog.com` | PostHog Dashboard |
| `JWT_SECRET` | Secret for JWT signing | - | Generate random string |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | Your frontend URL |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) | Custom value in ms |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | Custom value |

### Example `server/.env` File

```bash
# Required
PORT=3001
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXX
DATABASE_URL=postgresql://postgres:password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
FRONTEND_URL=http://localhost:5173

# Optional
NODE_ENV=development
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
FROM_EMAIL=noreply@yourdomain.com
SENTRY_DSN=https://XXXXXX@oXXXXXX.ingest.sentry.io/XXXXXX
SENTRY_ENVIRONMENT=development
POSTHOG_API_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
POSTHOG_HOST=https://app.posthog.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Production Environment Variables

### Frontend (Vercel)

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
VITE_API_URL=https://api.yourdomain.com/api
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXX
VITE_SENTRY_DSN=https://XXXXXX@oXXXXXX.ingest.sentry.io/XXXXXX
VITE_SENTRY_ENVIRONMENT=production
VITE_POSTHOG_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Backend (Railway/Render)

Set these in your hosting platform's environment variables:

```bash
NODE_ENV=production
PORT=3001
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXX
DATABASE_URL=postgresql://postgres:password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
FRONTEND_URL=https://yourdomain.com
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
FROM_EMAIL=noreply@yourdomain.com
SENTRY_DSN=https://XXXXXX@oXXXXXX.ingest.sentry.io/XXXXXX
SENTRY_ENVIRONMENT=production
POSTHOG_API_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
POSTHOG_HOST=https://app.posthog.com
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://yourdomain.com
```

---

## Security Best Practices

### ✅ Do

- Store all secrets in environment variables
- Use different keys for development and production
- Rotate secrets regularly (quarterly)
- Use strong, random values for `JWT_SECRET`
- Keep `.env` files in `.gitignore`
- Use environment-specific values (dev vs prod)

### ❌ Don't

- Commit `.env` files to Git
- Share secrets in chat or email
- Use production keys in development
- Hardcode secrets in source code
- Use weak or predictable secrets
- Reuse secrets across projects

---

## Generating Secrets

### JWT Secret

```bash
# Generate random 32-byte secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### API Keys

Most services provide API keys in their dashboards. Never generate your own API keys for third-party services.

---

## Environment Variable Validation

The application validates required environment variables on startup. If any are missing, you'll see an error message:

```
Error: Missing required environment variable: VITE_CLERK_PUBLISHABLE_KEY
```

---

## Troubleshooting

### Variables Not Loading

**Frontend:**
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- Check `.env` is in project root (not `src/`)

**Backend:**
- Restart server after changing `server/.env`
- Check `.env` is in `server/` directory
- Verify no typos in variable names

### CORS Errors

Ensure `CORS_ORIGIN` in backend matches `FRONTEND_URL`:
- Dev: `http://localhost:5173`
- Prod: `https://yourdomain.com`

### Authentication Errors

- Verify Clerk keys match (publishable and secret from same project)
- Check keys are for correct environment (test vs live)
- Ensure no extra spaces in keys

---

## Reference Links

- [Clerk API Keys](https://dashboard.clerk.com)
- [Supabase API Settings](https://app.supabase.com)
- [Resend API Keys](https://resend.com/api-keys)
- [Sentry DSN](https://sentry.io/settings/)
- [PostHog Project Settings](https://app.posthog.com/project/settings)

---

Last updated: 2026-04-29
