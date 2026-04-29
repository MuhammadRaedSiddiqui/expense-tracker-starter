# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the expense tracker application.

## Quick Diagnostics

Run these checks first:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if dev servers are running
curl http://localhost:5173  # Frontend
curl http://localhost:3001/health  # Backend

# Check for port conflicts
npx kill-port 5173 3001
```

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms**: Error messages during dependency installation

**Solutions**:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**
   ```bash
   node --version  # Should be 18.x or higher
   ```

3. **Use correct npm registry**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

4. **Check for permission issues**
   ```bash
   # On Unix/Mac, avoid using sudo
   # Fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
   ```

---

## Development Server Issues

### Issue: Frontend dev server won't start

**Symptoms**: `npm run dev` fails or hangs

**Solutions**:

1. **Check for port conflicts**
   ```bash
   npx kill-port 5173
   npm run dev
   ```

2. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Check environment variables**
   ```bash
   # Ensure .env exists and has required variables
   cat .env
   ```

4. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Backend server won't start

**Symptoms**: `cd server && npm run dev` fails

**Solutions**:

1. **Check for port conflicts**
   ```bash
   npx kill-port 3001
   cd server && npm run dev
   ```

2. **Verify database connection**
   ```bash
   # Test DATABASE_URL
   psql $DATABASE_URL -c "SELECT 1"
   ```

3. **Check environment variables**
   ```bash
   cd server
   cat .env
   # Ensure all required variables are set
   ```

4. **Check logs for specific errors**
   ```bash
   cd server
   npm run dev 2>&1 | tee server.log
   ```

---

## Authentication Issues

### Issue: Cannot sign in with Clerk

**Symptoms**: Sign-in page shows errors or redirects fail

**Solutions**:

1. **Verify Clerk configuration**
   - Check `VITE_CLERK_PUBLISHABLE_KEY` in frontend `.env`
   - Check `CLERK_SECRET_KEY` in backend `server/.env`
   - Verify keys match your Clerk dashboard

2. **Check Clerk dashboard**
   - Go to https://dashboard.clerk.com
   - Verify application is active
   - Check allowed redirect URLs include `http://localhost:5173`

3. **Clear browser data**
   - Clear cookies and localStorage
   - Try incognito/private mode
   - Try different browser

4. **Check browser console**
   - Open DevTools (F12)
   - Look for Clerk-related errors
   - Check Network tab for failed requests

### Issue: JWT token verification fails

**Symptoms**: API returns 401 Unauthorized

**Solutions**:

1. **Verify token is being sent**
   ```javascript
   // Check in browser console
   const token = await window.Clerk.session.getToken();
   console.log('Token:', token);
   ```

2. **Check backend verification**
   ```javascript
   // In backend, add logging
   console.log('Authorization header:', req.headers.authorization);
   ```

3. **Verify Clerk secret key**
   - Ensure `CLERK_SECRET_KEY` in backend `.env` is correct
   - Key should start with `sk_test_` or `sk_live_`

4. **Check token expiration**
   - Tokens expire after 1 hour by default
   - Try signing out and back in

---

## Database Issues

### Issue: Cannot connect to Supabase

**Symptoms**: Database queries fail, connection errors

**Solutions**:

1. **Verify DATABASE_URL**
   ```bash
   echo $DATABASE_URL
   # Should be: postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   ```

2. **Check Supabase project status**
   - Go to https://app.supabase.com
   - Verify project is active (not paused)
   - Check for service disruptions

3. **Test connection**
   ```bash
   psql $DATABASE_URL -c "SELECT NOW()"
   ```

4. **Check IP restrictions**
   - In Supabase dashboard → Settings → Database
   - Disable "Restrict connections to specific IPs" for development
   - Or add your IP to allowlist

### Issue: RLS policies blocking queries

**Symptoms**: Queries return empty results or permission errors

**Solutions**:

1. **Check RLS policies in Supabase**
   - Go to Authentication → Policies
   - Verify policies exist for your tables
   - Test policies with SQL editor

2. **Verify user authentication**
   ```sql
   -- In Supabase SQL editor
   SELECT auth.uid();  -- Should return your user ID
   ```

3. **Temporarily disable RLS for testing**
   ```sql
   -- ONLY FOR DEBUGGING
   ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
   -- Remember to re-enable after testing!
   ```

4. **Check organization membership**
   ```sql
   -- Verify you're a member of the organization
   SELECT * FROM organization_members WHERE user_id = auth.uid();
   ```

---

## API Issues

### Issue: API requests failing with CORS errors

**Symptoms**: Browser console shows CORS policy errors

**Solutions**:

1. **Verify CORS configuration**
   ```javascript
   // In server/src/index.js
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173'
   }));
   ```

2. **Check environment variables**
   ```bash
   # In server/.env
   FRONTEND_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Restart backend server**
   ```bash
   cd server
   npm run dev
   ```

### Issue: API returns 500 Internal Server Error

**Symptoms**: API requests fail with 500 status code

**Solutions**:

1. **Check backend logs**
   ```bash
   cd server
   npm run dev
   # Look for error stack traces
   ```

2. **Check Sentry dashboard**
   - Go to https://sentry.io
   - Look for recent errors
   - Check error details and stack trace

3. **Add debug logging**
   ```javascript
   // In problematic endpoint
   console.log('Request body:', req.body);
   console.log('User:', req.user);
   ```

4. **Test endpoint directly**
   ```bash
   curl -X POST http://localhost:3001/api/transactions \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"type":"expense","amount":50}'
   ```

---

## Frontend Issues

### Issue: Components not rendering

**Symptoms**: Blank page or missing components

**Solutions**:

1. **Check browser console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check for failed imports

2. **Verify component imports**
   ```javascript
   // Check import paths are correct
   import TransactionForm from './components/TransactionForm';
   ```

3. **Check for syntax errors**
   ```bash
   npm run lint
   ```

4. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue: State not updating

**Symptoms**: UI doesn't reflect changes, stale data

**Solutions**:

1. **Check TanStack Query cache**
   ```javascript
   // Invalidate queries after mutations
   queryClient.invalidateQueries(['transactions']);
   ```

2. **Verify mutation success**
   ```javascript
   const mutation = useMutation({
     onSuccess: () => {
       console.log('Mutation successful');
       queryClient.invalidateQueries(['transactions']);
     },
     onError: (error) => {
       console.error('Mutation failed:', error);
     }
   });
   ```

3. **Check for race conditions**
   - Ensure async operations complete before updating state
   - Use proper loading states

---

## Real-time Issues

### Issue: Real-time updates not working

**Symptoms**: Changes by other users don't appear automatically

**Solutions**:

1. **Verify WebSocket connection**
   ```javascript
   // Check in browser console
   const subscription = supabase
     .channel('transactions')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, 
       payload => console.log('Change received:', payload)
     )
     .subscribe();
   ```

2. **Check Supabase real-time settings**
   - Go to Supabase dashboard → Database → Replication
   - Ensure real-time is enabled for your tables

3. **Verify subscription cleanup**
   ```javascript
   useEffect(() => {
     const subscription = supabase.channel('transactions').subscribe();
     
     return () => {
       subscription.unsubscribe();
     };
   }, []);
   ```

---

## Performance Issues

### Issue: App is slow or laggy

**Symptoms**: Slow page loads, delayed interactions

**Solutions**:

1. **Check network requests**
   - Open DevTools → Network tab
   - Look for slow or failed requests
   - Check request/response sizes

2. **Enable React DevTools Profiler**
   - Install React DevTools extension
   - Profile component renders
   - Look for unnecessary re-renders

3. **Optimize queries**
   ```javascript
   // Add pagination
   const { data } = useQuery({
     queryKey: ['transactions', page],
     queryFn: () => fetchTransactions({ page, limit: 50 })
   });
   ```

4. **Check database query performance**
   ```sql
   -- In Supabase SQL editor
   EXPLAIN ANALYZE SELECT * FROM transactions WHERE organization_id = 'xxx';
   ```

---

## Build Issues

### Issue: Production build fails

**Symptoms**: `npm run build` fails with errors

**Solutions**:

1. **Check for TypeScript errors**
   ```bash
   npm run type-check  # If using TypeScript
   ```

2. **Check for linting errors**
   ```bash
   npm run lint
   ```

3. **Verify environment variables**
   ```bash
   # Ensure all VITE_ variables are set
   cat .env
   ```

4. **Clear build cache**
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

---

## Email Issues

### Issue: Invitation emails not sending

**Symptoms**: Users don't receive invitation emails

**Solutions**:

1. **Verify Resend API key**
   ```bash
   # In server/.env
   echo $RESEND_API_KEY
   ```

2. **Check Resend dashboard**
   - Go to https://resend.com/emails
   - Look for failed emails
   - Check error messages

3. **Verify sender domain**
   - Ensure `FROM_EMAIL` domain is verified in Resend
   - Check DNS records are correct

4. **Check spam folder**
   - Emails might be marked as spam
   - Add sender to contacts

5. **Test email sending**
   ```bash
   curl -X POST http://localhost:3001/api/test-email \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Getting More Help

If you're still stuck:

1. **Check existing issues**: https://github.com/your-org/expense-tracker/issues
2. **Create a new issue**: Include error messages, logs, and steps to reproduce
3. **Join community chat**: Discord/Slack (if available)
4. **Check documentation**: See [docs/](docs/) folder

---

Last updated: 2026-04-29
