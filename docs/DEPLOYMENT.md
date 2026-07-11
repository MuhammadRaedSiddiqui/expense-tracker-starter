# Finance Tracker - Deployment Guide

Complete guide for deploying Finance Tracker to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup (Supabase)](#database-setup-supabase)
4. [Authentication Setup (Clerk)](#authentication-setup-clerk)
5. [Email Setup (Resend)](#email-setup-resend)
6. [Monitoring Setup](#monitoring-setup)
7. [Backend Deployment](#backend-deployment)
8. [Frontend Deployment](#frontend-deployment)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- Git installed
- Accounts created for:
  - Supabase (database)
  - Clerk (authentication)
  - Resend (email)
  - Sentry (error tracking)
  - PostHog (analytics)
  - Vercel/Netlify (frontend hosting)
  - Railway/Render/Heroku (backend hosting)

---

## Environment Setup

### Frontend Environment Variables

Create `.env.local` in the project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API
VITE_API_URL=https://your-backend.railway.app

# Sentry
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# PostHog
VITE_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_xxxxx
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Backend Environment Variables

Create `.env` in the `server` directory:

```env
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# Clerk
CLERK_SECRET_KEY=sk_live_xxxxx

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend
RESEND_API_KEY=re_xxxxx
```

---

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it securely)
5. Wait for project to be created

### 2. Run Migrations

Navigate to SQL Editor in Supabase dashboard and run migrations in order:

```bash
# Run each migration file in order:
supabase/migrations/20260405000000_initial_schema.sql
supabase/migrations/20260405000001_add_rls_policies.sql
supabase/migrations/20260406000000_create_recurring_transactions.sql
supabase/migrations/20260406000001_fix_recurring_transactions.sql
supabase/migrations/20260406000002_create_budgets.sql
supabase/migrations/20260406000003_fix_budgets.sql
supabase/migrations/20260406000004_fix_budgets_columns.sql
```

Or use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 3. Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL (VITE_SUPABASE_URL)
   - Anon/Public key (VITE_SUPABASE_ANON_KEY)
   - Service Role key (SUPABASE_SERVICE_KEY) - Keep secret!

### 4. Configure Row Level Security

RLS policies are included in migrations. Verify they're active:

1. Go to Authentication > Policies
2. Ensure all tables have policies enabled
3. Test with a non-admin user

---

## Authentication Setup (Clerk)

### 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com)
2. Click "Add Application"
3. Choose authentication methods:
   - Email/Password
   - Google OAuth (optional)
   - GitHub OAuth (optional)
4. Set application name

### 2. Configure Clerk

**Development URLs:**
- Sign-in URL: `http://localhost:5173/sign-in`
- Sign-up URL: `http://localhost:5173/sign-up`
- After sign-in: `http://localhost:5173/dashboard`

**Production URLs:**
- Sign-in URL: `https://your-app.vercel.app/sign-in`
- Sign-up URL: `https://your-app.vercel.app/sign-up`
- After sign-in: `https://your-app.vercel.app/dashboard`

### 3. Get API Keys

1. Go to API Keys
2. Copy:
   - Publishable Key (VITE_CLERK_PUBLISHABLE_KEY)
   - Secret Key (CLERK_SECRET_KEY) - Keep secret!

### 4. Configure JWT Template

1. Go to JWT Templates
2. Create new template named "supabase"
3. Add claims:
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "role": "authenticated"
}
```

---

## Email Setup (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Verify your email

### 2. Add Domain (Production)

For production, add your domain:

1. Go to Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records to your domain provider:
   - TXT record for verification
   - MX records for email delivery
5. Wait for verification (can take up to 48 hours)

### 3. Get API Key

1. Go to API Keys
2. Create new API key
3. Copy key (RESEND_API_KEY)

### 4. Test Email

Development uses `onboarding@resend.dev` (limited to your account email).

Production should use your verified domain:
```javascript
from: 'Finance Tracker <noreply@yourdomain.com>'
```

---

## Monitoring Setup

### Sentry (Error Tracking)

1. Go to [sentry.io](https://sentry.io)
2. Create new project (React + Node.js)
3. Copy DSN (VITE_SENTRY_DSN)
4. Configure alerts:
   - Email notifications for errors
   - Slack integration (optional)
5. Set up releases for better tracking

### PostHog (Analytics)

1. Go to [posthog.com](https://posthog.com)
2. Create new project
3. Copy:
   - Project API Key (VITE_PUBLIC_POSTHOG_PROJECT_TOKEN)
   - Host URL (VITE_PUBLIC_POSTHOG_HOST)
4. Configure:
   - Session recording (optional)
   - Feature flags (optional)
   - Funnels and insights

---

## Backend Deployment

### Option 1: Railway

**Advantages**: Easy setup, automatic deployments, PostgreSQL included

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Configure:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables
7. Deploy

**Custom Domain:**
1. Go to Settings > Domains
2. Add custom domain
3. Update DNS records

### Option 2: Render

**Advantages**: Free tier available, good for small projects

1. Go to [render.com](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect repository
5. Configure:
   - Name: finance-tracker-api
   - Environment: Node
   - Build command: `cd server && npm install`
   - Start command: `cd server && npm start`
6. Add environment variables
7. Create service

### Option 3: Heroku

**Advantages**: Mature platform, many add-ons

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create finance-tracker-api`
4. Add buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set environment variables:
```bash
heroku config:set CLERK_SECRET_KEY=sk_live_xxxxx
heroku config:set SUPABASE_URL=https://xxxxx.supabase.co
# ... add all variables
```
6. Deploy:
```bash
git subtree push --prefix server heroku main
```

### Configure Scheduler (for Recurring Transactions)

**Railway/Render:**
- Use built-in cron jobs
- Or use external service like [cron-job.org](https://cron-job.org)

**Heroku:**
```bash
heroku addons:create scheduler:standard
heroku addons:open scheduler
```
Add job: `node server/lib/recurringProcessor.js` (daily at 2 AM)

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Advantages**: Optimized for React, automatic deployments, edge network

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Deploy

**Custom Domain:**
1. Go to Project Settings > Domains
2. Add custom domain
3. Update DNS records (A or CNAME)

**Environment Variables:**
- Add all `VITE_*` variables
- Mark sensitive variables as "Encrypted"

### Option 2: Netlify

**Advantages**: Simple setup, good free tier

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site"
3. Import from Git
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Deploy

**Redirects:**
Create `public/_redirects`:
```
/*    /index.html   200
```

### Option 3: Cloudflare Pages

**Advantages**: Fast global CDN, generous free tier

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Connect repository
4. Configure:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output: `dist`
5. Add environment variables
6. Deploy

---

## Post-Deployment

### 1. Verify Deployment

**Backend Health Check:**
```bash
curl https://your-backend.railway.app/health
```

**Frontend:**
- Visit your domain
- Test sign-up flow
- Create test transaction
- Verify real-time updates

### 2. Configure CORS

Update backend CORS settings:

```javascript
// server/index.js
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:5173' // Keep for development
  ],
  credentials: true
}));
```

### 3. Set Up Monitoring

**Sentry:**
- Verify errors are being captured
- Set up alerts
- Configure release tracking

**PostHog:**
- Verify events are being tracked
- Set up dashboards
- Configure funnels

### 4. Performance Optimization

**Frontend:**
- Enable Vercel Analytics
- Configure caching headers
- Optimize images

**Backend:**
- Enable compression
- Add rate limiting
- Configure database connection pooling

### 5. Security Checklist

- [ ] All environment variables are set
- [ ] Sensitive keys are not in code
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] RLS policies are active
- [ ] Rate limiting is enabled
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date

### 6. Backup Strategy

**Database:**
- Supabase automatic backups (daily)
- Manual backups before major changes
- Export data regularly

**Code:**
- Git repository is backed up
- Tag releases: `git tag v1.0.0`

---

## Troubleshooting

### Build Failures

**Frontend:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

**Backend:**
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache
rm -rf node_modules
npm install
```

### Database Connection Issues

1. Check Supabase project status
2. Verify connection string
3. Check RLS policies
4. Test with Supabase SQL editor

### Authentication Issues

1. Verify Clerk keys are correct
2. Check redirect URLs
3. Test JWT token generation
4. Verify CORS settings

### Email Not Sending

1. Check Resend API key
2. Verify domain is verified (production)
3. Check email logs in Resend dashboard
4. Test with development email

### Real-Time Not Working

1. Check Supabase connection
2. Verify WebSocket support
3. Falls back to polling automatically
4. Check browser console for errors

### Performance Issues

**Slow API:**
- Check database indexes
- Enable query caching
- Optimize N+1 queries
- Add connection pooling

**Slow Frontend:**
- Check bundle size
- Enable code splitting
- Optimize images
- Use CDN for assets

---

## Scaling Considerations

### Database

**Supabase Free Tier Limits:**
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users

**Upgrade Path:**
- Pro plan: $25/month
- Dedicated database for high traffic
- Read replicas for scaling reads

### Backend

**Horizontal Scaling:**
- Add more server instances
- Use load balancer
- Implement session storage (Redis)

**Vertical Scaling:**
- Increase server resources
- Optimize code
- Add caching layer

### Frontend

**CDN:**
- Already handled by Vercel/Netlify
- Add image CDN (Cloudinary)
- Use edge functions for dynamic content

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs (Sentry)
- Review analytics (PostHog)
- Monitor server health

**Monthly:**
- Update dependencies
- Review database performance
- Check backup integrity
- Analyze costs

**Quarterly:**
- Security audit
- Performance review
- User feedback review
- Feature planning

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Major version updates
npm install package@latest

# Test thoroughly after updates
npm test
npm run build
```

### Database Maintenance

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum and analyze
VACUUM ANALYZE;
```

---

## Cost Estimation

### Free Tier (Development/Small Projects)

- Supabase: Free (up to 500 MB)
- Clerk: Free (up to 5,000 MAU)
- Resend: Free (100 emails/day)
- Sentry: Free (5,000 errors/month)
- PostHog: Free (1M events/month)
- Vercel: Free (100 GB bandwidth)
- Railway: Free ($5 credit/month)

**Total: $0/month** (within limits)

### Production (Small Business)

- Supabase Pro: $25/month
- Clerk Pro: $25/month
- Resend: $20/month (50k emails)
- Sentry Team: $26/month
- PostHog: $0 (self-hosted) or $450/month
- Vercel Pro: $20/month
- Railway: $20/month

**Total: ~$136-586/month**

### Enterprise

- Custom pricing for all services
- Dedicated support
- SLA guarantees
- Advanced features

---

## Support

For deployment issues:
- Check service status pages
- Review documentation
- Contact support teams
- Community forums

---

## Next Steps

After successful deployment:
1. Set up monitoring dashboards
2. Configure alerts
3. Document custom configurations
4. Train team on deployment process
5. Plan for disaster recovery

Congratulations on deploying Finance Tracker! 🎉
