# Quick Start Guide

Get the expense tracker running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts created (free tiers work):
  - [Supabase](https://supabase.com)
  - [Clerk](https://clerk.com)

## Step 1: Clone and Install (2 min)

```bash
# Clone repository
git clone <repository-url>
cd expense-tracker-starter

# Install dependencies
npm install
cd server && npm install && cd ..
```

## Step 2: Set Up Supabase (3 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for database to initialize (~2 minutes)
3. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (click "Reveal")
4. Go to **SQL Editor** and run this migration:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can read own organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Users can read org transactions" ON transactions
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = (SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

## Step 3: Set Up Clerk (2 min)

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Choose **Email** as sign-in method
3. Go to **API Keys** and copy:
   - Publishable Key (starts with `pk_test_`)
   - Secret Key (starts with `sk_test_`)

## Step 4: Configure Environment Variables (1 min)

Create `.env` in project root:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Create `server/.env`:

```bash
PORT=3001
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
FRONTEND_URL=http://localhost:5173
```

## Step 5: Start Development Servers (1 min)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

## Step 6: Test the App (1 min)

1. Open http://localhost:5173
2. Click **Sign Up**
3. Create an account
4. Add your first transaction!

## ✅ You're Done!

The app is now running locally. Next steps:

- **Add transactions** - Try adding income and expenses
- **Explore features** - Check out budgets, filters, and charts
- **Read docs** - See [docs/](docs/) for detailed documentation
- **Deploy** - See [DEPLOYMENT.md](docs/DEPLOYMENT.md) when ready

## 🆘 Troubleshooting

**Frontend won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend won't start:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Can't sign in:**
- Check Clerk keys in `.env`
- Verify Clerk dashboard shows your app is active
- Try incognito mode

**Database errors:**
- Verify Supabase project is active (not paused)
- Check environment variables are correct
- Ensure RLS policies were created

## 📚 Next Steps

- [Development Guide](docs/DEVELOPMENT.md) - Detailed setup
- [User Guide](USER_GUIDE.md) - How to use the app
- [API Reference](docs/API_REFERENCE.md) - API documentation
- [Contributing](docs/CONTRIBUTING.md) - How to contribute

---

**Need help?** Create an issue on GitHub or check the [FAQ](docs/FAQ.md).
