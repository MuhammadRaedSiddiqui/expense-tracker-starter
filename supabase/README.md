# Supabase Setup Guide

This guide will help you set up Supabase for the Expense Tracker application.

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
   - Choose a project name (e.g., "expense-tracker")
   - Set a strong database password (save this!)
   - Select a region close to your users

## Step 2: Get Your Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Add these to your `.env.local` file:
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Easiest)

1. Go to SQL Editor in your Supabase dashboard
2. Run each migration file in order:
   - Copy contents of `supabase/migrations/00001_initial_schema.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Repeat for `00002_row_level_security.sql`
   - Repeat for `00003_default_categories.sql`

### Option B: Using Supabase CLI (Recommended for production)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Push migrations:
```bash
supabase db push
```

## Step 4: Verify Setup

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- organizations
- organization_members
- categories
- transactions
- attachments
- budgets
- recurring_transactions
- invitations
- audit_logs

## Step 5: Test Row Level Security

1. Go to Authentication → Policies
2. Verify that RLS is enabled on all tables
3. Check that policies are created for each table

## Step 6: Configure Storage (For Receipt Attachments)

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `receipts`
3. Set bucket to **private** (not public)
4. Add storage policy:

```sql
-- Allow authenticated users to upload receipts
CREATE POLICY "Users can upload receipts to their org"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts'
  AND auth.role() = 'authenticated'
);

-- Allow users to view receipts from their org
CREATE POLICY "Users can view receipts from their org"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts'
  AND auth.role() = 'authenticated'
);
```

## Database Schema Overview

### Core Tables

**organizations**
- Stores organization/company information
- Tracks subscription tier and status
- Links to Stripe customer

**organization_members**
- Links users to organizations
- Defines roles (owner, admin, member, viewer)
- Tracks invitations and join dates

**transactions**
- Main transaction records
- Links to organization and creator
- Supports multi-currency

**categories**
- Custom categories per organization
- Separate for income/expense
- Default categories auto-created

**budgets**
- Budget limits per category
- Alert thresholds
- Period-based (monthly, quarterly, yearly)

**recurring_transactions**
- Template for recurring transactions
- Auto-creates transactions via cron job
- Supports various frequencies

**attachments**
- Receipt/invoice files
- Links to transactions
- Stored in Supabase Storage

**invitations**
- Team member invitations
- Token-based with expiration
- Tracks acceptance

**audit_logs**
- Activity logging
- Tracks all sensitive actions
- Includes IP and user agent

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access data from their organizations
- Role-based permissions (owner, admin, member, viewer)
- Proper isolation between organizations

## Helper Functions

**is_organization_member(org_id)**
- Returns true if current user is member of organization

**get_user_role(org_id)**
- Returns user's role in organization

**create_default_categories(org_id)**
- Creates default income/expense categories for new org

## Next Steps

After Supabase is set up:
1. Install Supabase client: `npm install @supabase/supabase-js`
2. Create Supabase client configuration in `src/lib/supabase.js`
3. Replace localStorage with Supabase queries
4. Test authentication flow

## Troubleshooting

**Can't connect to Supabase?**
- Check your project URL and anon key
- Verify project is not paused (free tier pauses after 1 week inactivity)
- Check network/firewall settings

**RLS policies not working?**
- Verify RLS is enabled on tables
- Check that auth.uid() returns a value (user must be authenticated)
- Test policies in SQL Editor with different user contexts

**Migrations failed?**
- Run migrations in order (00001, 00002, 00003)
- Check for syntax errors in SQL
- Verify UUID extension is enabled

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
