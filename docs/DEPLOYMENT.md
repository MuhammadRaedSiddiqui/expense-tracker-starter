# Deployment Guide

This guide covers deploying the expense tracker application to production.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Accounts for:
  - Vercel (frontend hosting)
  - Railway/Render/Fly.io (backend hosting)
  - Supabase (database)
  - Clerk (authentication)
  - Resend (email)
  - Sentry (error tracking)
  - PostHog (analytics)

## Environment Variables

### Frontend (.env)

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# API Configuration
VITE_API_URL=https://api.your-domain.com

# Supabase (for real-time subscriptions)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx

# Analytics
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com

# Sentry
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
```

### Backend (.env)

```bash
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_xxx
CLERK_PUBLISHABLE_KEY=pk_live_xxx

# Supabase Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Email (Resend)
RESEND_API_KEY=re_xxx
FROM_EMAIL=noreply@your-domain.com

# Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ENVIRONMENT=production

# PostHog
POSTHOG_API_KEY=phc_xxx
POSTHOG_HOST=https://app.posthog.com

# Security
JWT_SECRET=your-secure-random-string
CORS_ORIGIN=https://your-domain.com
```

## Deployment Steps

### 1. Database Setup (Supabase)

1. Create a new Supabase project
2. Run database migrations:
   ```bash
   cd server
   npm run db:migrate
   ```
3. Enable Row Level Security on all tables
4. Verify RLS policies are active
5. Set up database backups (automatic on Supabase)

### 2. Backend Deployment (Railway Example)

1. **Create Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Configure Environment Variables**
   - Add all backend environment variables in Railway dashboard
   - Ensure `DATABASE_URL` points to Supabase

3. **Deploy**
   ```bash
   cd server
   railway up
   ```

4. **Verify Deployment**
   ```bash
   curl https://your-backend.railway.app/health
   ```

5. **Set Up Cron Jobs**
   - Railway automatically runs `node-cron` tasks
   - Verify cron logs in Railway dashboard

### 3. Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import your Git repository
   - Select the root directory

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Add all `VITE_*` variables in Vercel dashboard
   - Ensure `VITE_API_URL` points to your backend

4. **Configure Routing**
   Create `vercel.json` in project root:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

### 4. Configure Clerk

1. **Update Clerk Dashboard**
   - Add production domain to allowed origins
   - Configure redirect URLs:
     - Sign-in: `https://your-domain.com/sign-in`
     - Sign-up: `https://your-domain.com/sign-up`
     - After sign-in: `https://your-domain.com/dashboard`

2. **Set Up Webhooks**
   - Webhook URL: `https://your-backend.railway.app/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret to backend env vars

### 5. Configure Monitoring

#### Sentry

1. Create projects for frontend and backend
2. Add DSNs to environment variables
3. Verify error reporting:
   ```bash
   # Test error
   curl https://your-backend.railway.app/test-error
   ```

#### PostHog

1. Create project in PostHog
2. Add API key to environment variables
3. Verify event tracking in PostHog dashboard

### 6. DNS Configuration

1. **Add Custom Domain in Vercel**
   - Go to project settings → Domains
   - Add your domain (e.g., `app.your-domain.com`)
   - Update DNS records as instructed

2. **Add Backend Domain**
   - Configure Railway custom domain (e.g., `api.your-domain.com`)
   - Update DNS CNAME record

3. **Update Environment Variables**
   - Update `VITE_API_URL` in Vercel
   - Update `FRONTEND_URL` in Railway
   - Redeploy both services

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] RLS policies active and tested
- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] User can sign up and sign in
- [ ] Transactions can be created/edited/deleted
- [ ] Real-time updates working
- [ ] Email invitations sending
- [ ] Sentry receiving errors
- [ ] PostHog receiving events
- [ ] Cron jobs running on schedule
- [ ] SSL certificates active
- [ ] Custom domains configured
- [ ] CORS configured correctly
- [ ] Rate limiting active

## Monitoring & Maintenance

### Health Checks

Set up uptime monitoring (e.g., UptimeRobot, Better Uptime):
- Frontend: `https://your-domain.com`
- Backend: `https://api.your-domain.com/health`

### Log Monitoring

- **Backend Logs**: Railway dashboard or `railway logs`
- **Frontend Errors**: Sentry dashboard
- **Database Logs**: Supabase dashboard

### Performance Monitoring

- **Frontend**: Vercel Analytics
- **Backend**: Railway metrics
- **Database**: Supabase dashboard → Performance

### Backup Strategy

- **Database**: Supabase automatic daily backups (7-day retention)
- **Manual Backup**: 
  ```bash
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
  ```

### Scaling

#### Frontend (Vercel)
- Automatic scaling included
- Monitor bandwidth usage

#### Backend (Railway)
- Upgrade plan for more resources
- Consider horizontal scaling for high traffic

#### Database (Supabase)
- Monitor connection pool usage
- Upgrade plan if approaching limits
- Consider read replicas for heavy read workloads

## Rollback Procedure

### Frontend
```bash
# Revert to previous deployment in Vercel dashboard
# Or redeploy specific commit
vercel --prod --force
```

### Backend
```bash
# Railway: revert to previous deployment in dashboard
# Or redeploy specific commit
railway up
```

### Database
```bash
# Restore from backup
psql $DATABASE_URL < backup-20260429.sql
```

## Troubleshooting

### Frontend Not Loading
1. Check Vercel deployment logs
2. Verify environment variables
3. Check browser console for errors
4. Verify API URL is correct

### Backend Errors
1. Check Railway logs: `railway logs`
2. Verify database connection
3. Check Sentry for error details
4. Verify Clerk webhook signature

### Database Connection Issues
1. Check Supabase status page
2. Verify connection string
3. Check connection pool limits
4. Review RLS policies

### Email Not Sending
1. Verify Resend API key
2. Check Resend dashboard for errors
3. Verify sender domain is verified
4. Check email logs in backend

## Security Considerations

- [ ] All secrets stored in environment variables (never in code)
- [ ] HTTPS enforced on all domains
- [ ] CORS configured to allow only your frontend domain
- [ ] Rate limiting enabled
- [ ] RLS policies tested and active
- [ ] Clerk webhook signature verification enabled
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] Dependencies regularly updated
- [ ] Sentry monitoring active for security issues

## Cost Estimation (Monthly)

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| Vercel | ✓ (Hobby) | $20+ (Pro) |
| Railway | $5 credit | $5+ (usage-based) |
| Supabase | ✓ (500MB DB) | $25+ (Pro) |
| Clerk | ✓ (10k MAU) | $25+ (Pro) |
| Resend | ✓ (100 emails/day) | $20+ (Pro) |
| Sentry | ✓ (5k errors/mo) | $26+ (Team) |
| PostHog | ✓ (1M events/mo) | $0+ (usage-based) |

**Total**: $0-$150+/month depending on usage
