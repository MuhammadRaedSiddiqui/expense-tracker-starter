# Vercel Deployment Guide

This guide will help you deploy the Expense Tracker application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Code pushed to GitHub repository

## Step 1: Prepare for Deployment

### 1.1 Test Local Build

Before deploying, ensure your app builds successfully:

```bash
npm run build
```

This should create a `dist/` folder with your production build.

### 1.2 Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Step 2: Connect to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect it's a Vite project

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to link your project

## Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

**Required for Production:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_POSTHOG_API_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://app.posthog.com
VITE_ENV=production
```

**Important:** 
- Add variables to **Production**, **Preview**, and **Development** environments
- Use different values for each environment if needed

## Step 4: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 5: Deploy

### First Deployment

1. Push code to GitHub
2. Vercel will automatically deploy
3. Wait for build to complete (usually 1-2 minutes)
4. Visit your deployment URL (e.g., `your-app.vercel.app`)

### Subsequent Deployments

Every push to your main branch will trigger a new deployment automatically.

## Step 6: Set Up Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Step 7: Configure Serverless Functions

Your API endpoints in `/api` folder will automatically become serverless functions:

- `/api/health` → `https://your-app.vercel.app/api/health`
- `/api/transactions` → `https://your-app.vercel.app/api/transactions`

### Test API Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "0.1.0"
}
```

## Step 8: Set Up Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Non-production branches

Each preview gets a unique URL like:
`your-app-git-feature-branch.vercel.app`

### Configure Preview Environment

1. Go to **Project Settings** → **Git**
2. Enable **Automatic Preview Deployments**
3. Configure which branches trigger previews

## Step 9: Monitor Deployments

### Deployment Dashboard

View all deployments at:
`https://vercel.com/your-username/your-project`

Each deployment shows:
- Build logs
- Runtime logs
- Performance metrics
- Error tracking

### Build Logs

If deployment fails:
1. Click on the failed deployment
2. View **Build Logs** tab
3. Fix errors and push again

## Step 10: Configure Production Settings

### Performance

1. **Edge Network:** Enabled by default (CDN)
2. **Compression:** Enabled by default (Brotli/Gzip)
3. **Image Optimization:** Configure if using images

### Security

1. **HTTPS:** Enabled by default
2. **Security Headers:** Add in `vercel.json`:

```json
{
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

## Troubleshooting

### Build Fails

**Error: "Command failed: npm run build"**
- Run `npm run build` locally to see the error
- Check for TypeScript errors
- Verify all dependencies are in `package.json`

**Error: "Module not found"**
- Ensure all imports use correct paths
- Check for case-sensitive file names
- Verify dependencies are installed

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix
- Check they're added to correct environment (Production/Preview)
- Redeploy after adding variables

### API Routes Not Working

- Verify files are in `/api` folder
- Check function syntax (must export default handler)
- View function logs in Vercel dashboard

### Slow Build Times

- Enable **Build Cache** in project settings
- Use `npm ci` instead of `npm install`
- Optimize dependencies (remove unused packages)

## CI/CD Integration

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Optimization

### 1. Enable Analytics

- Go to **Analytics** tab in Vercel
- View real user metrics
- Monitor Core Web Vitals

### 2. Configure Caching

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Optimize Bundle Size

```bash
# Analyze bundle
npm run build -- --mode analyze

# Remove unused dependencies
npm prune
```

## Monitoring Production

### 1. Set Up Alerts

- Configure Vercel notifications
- Connect to Slack for deployment alerts
- Set up uptime monitoring (UptimeRobot)

### 2. View Logs

```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs your-app.vercel.app
```

### 3. Performance Monitoring

- Use Vercel Analytics
- Monitor with Sentry (already configured)
- Track with PostHog (already configured)

## Cost Management

### Free Tier Limits

- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- 6,000 build minutes/month
- Unlimited deployments

### Staying Within Limits

- Optimize images and assets
- Use CDN caching effectively
- Minimize serverless function execution time
- Monitor usage in dashboard

## Next Steps

After successful deployment:

1. ✅ Test all features in production
2. ✅ Verify API endpoints work
3. ✅ Check environment variables are loaded
4. ✅ Test authentication flow (Phase 1)
5. ✅ Monitor errors in Sentry
6. ✅ Track usage in PostHog

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions)
