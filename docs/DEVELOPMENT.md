# Development Guide

This guide covers setting up the expense tracker application for local development.

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd expense-tracker-starter
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Environment Variables

Create `.env` in the project root:

```bash
# Clerk Authentication (Development)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Supabase (Development)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx

# Analytics (Optional for development)
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com

# Sentry (Optional for development)
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=development
```

#### Backend Environment Variables

Create `server/.env`:

```bash
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Clerk Authentication (Development)
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Supabase Database (Development)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Email (Resend - Development)
RESEND_API_KEY=re_xxx
FROM_EMAIL=dev@your-domain.com

# Sentry (Optional)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ENVIRONMENT=development

# PostHog (Optional)
POSTHOG_API_KEY=phc_xxx
POSTHOG_HOST=https://app.posthog.com

# Security
JWT_SECRET=your-dev-secret-key
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Setup

```bash
cd server

# Run migrations
npm run db:migrate

# Seed development data (optional)
npm run db:seed
```

### 5. Start Development Servers

#### Terminal 1 - Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 2 - Backend
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

## Project Structure

```
expense-tracker-starter/
├── .claude/                    # Claude Code configuration
│   ├── memory/                 # AI memory files
│   ├── rules/                  # Project-specific rules
│   └── settings.local.json     # Local settings
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
├── public/                     # Static assets
├── server/                     # Backend application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── cron/              # Scheduled tasks
│   │   └── index.js           # Server entry point
│   ├── migrations/            # Database migrations
│   ├── seeds/                 # Database seeds
│   └── package.json
├── src/                        # Frontend application
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Libraries and utilities
│   ├── constants.js           # Constants
│   ├── utils.js               # Utility functions
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── .env                        # Frontend environment variables
├── .gitignore
├── CLAUDE.md                   # Claude Code instructions
├── package.json
├── vite.config.js             # Vite configuration
└── README.md
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the project's style guide
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run linter
   npm run lint
   
   # Run tests
   npm test
   
   # Test in browser
   # Visit http://localhost:5173
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add budget alerts feature
fix: resolve transaction date sorting issue
docs: update API reference for new endpoints
refactor: extract transaction logic into service
```

## Code Style

### JavaScript/React

- Use ES6+ features
- Prefer functional components with hooks
- Use destructuring for props
- Keep components small and focused
- Extract reusable logic into custom hooks

**Example:**
```jsx
// Good
const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { type, amount, description } = transaction;
  
  return (
    <div className="transaction-item">
      <span>{description}</span>
      <span>{formatCurrency(amount)}</span>
    </div>
  );
};

// Avoid
const TransactionItem = (props) => {
  return (
    <div className="transaction-item">
      <span>{props.transaction.description}</span>
      <span>{formatCurrency(props.transaction.amount)}</span>
    </div>
  );
};
```

### File Naming

- Components: PascalCase (e.g., `TransactionForm.jsx`)
- Utilities: camelCase (e.g., `formatCurrency.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Import Order

1. React and external libraries
2. Internal components
3. Utilities and constants
4. Styles

```jsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

import { formatCurrency } from './utils';
import { TRANSACTION_TYPES } from './constants';

import './App.css';
```

## Debugging

### Frontend Debugging

1. **React DevTools**
   - Install React DevTools browser extension
   - Inspect component hierarchy and props

2. **Console Logging**
   ```jsx
   console.log('Transaction data:', transaction);
   ```

3. **Vite Debug Mode**
   ```bash
   DEBUG=vite:* npm run dev
   ```

### Backend Debugging

1. **Node.js Inspector**
   ```bash
   node --inspect src/index.js
   ```
   Then open `chrome://inspect` in Chrome

2. **Debug Logging**
   ```javascript
   console.log('[DEBUG] User ID:', userId);
   ```

3. **Postman/Thunder Client**
   - Test API endpoints directly
   - Inspect request/response

### Database Debugging

1. **Supabase Dashboard**
   - View table data
   - Run SQL queries
   - Check RLS policies

2. **SQL Logging**
   ```javascript
   // Enable query logging in development
   const { data, error } = await supabase
     .from('transactions')
     .select('*')
     .explain();
   ```

## Common Tasks

### Adding a New Component

1. Create component file in `src/components/`
2. Export component
3. Import and use in parent component
4. Add styles if needed

### Adding a New API Endpoint

1. Create route in `server/src/routes/`
2. Create controller in `server/src/controllers/`
3. Add business logic in `server/src/services/`
4. Update API documentation

### Adding a Database Table

1. Create migration file in `server/migrations/`
2. Define table schema
3. Add RLS policies
4. Run migration
5. Update database documentation

### Adding a New Feature

1. Plan the feature (create tasks if complex)
2. Update database schema if needed
3. Create backend API endpoints
4. Create frontend components
5. Add tests
6. Update documentation

## Testing

### Manual Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Create transaction
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Filter transactions
- [ ] Search transactions
- [ ] Create budget
- [ ] Invite team member
- [ ] Accept invitation
- [ ] Switch organizations
- [ ] Test dark mode
- [ ] Test responsive design

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Frontend Issues

**Issue**: Vite dev server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Environment variables not loading
- Ensure `.env` file exists in project root
- Restart dev server after changing `.env`
- Variables must start with `VITE_`

### Backend Issues

**Issue**: Database connection fails
- Check `DATABASE_URL` in `server/.env`
- Verify Supabase project is active
- Check network connectivity

**Issue**: Clerk authentication fails
- Verify Clerk keys in `.env`
- Check Clerk dashboard for API status
- Ensure webhook URL is correct

### Common Errors

**Error**: `CORS policy blocked`
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches

**Error**: `Module not found`
- Run `npm install` in correct directory
- Check import paths

**Error**: `Port already in use`
```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 3001 (backend)
npx kill-port 3001
```

## Performance Tips

### Frontend Optimization

- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load routes with React.lazy
- Optimize images (use WebP format)
- Enable TanStack Query caching

### Backend Optimization

- Add database indexes for frequent queries
- Use connection pooling
- Implement caching (Redis)
- Paginate large result sets
- Use database views for complex queries

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query)

## Getting Help

- Check existing documentation in `docs/`
- Search GitHub issues
- Ask in team chat
- Create a new GitHub issue with:
  - Clear description of the problem
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
