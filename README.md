# Finance Tracker - Production-Ready Expense Management

A full-stack, multi-tenant expense tracking application with team collaboration, real-time updates, budgets, recurring transactions, and comprehensive analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-6.0-blue.svg)

## Features

### Transaction Management
- Track income and expenses with detailed categorization
- Multi-currency support (10 currencies with real-time exchange rates)
- Advanced filtering (type, category, date range, search)
- Sorting by date, amount, or description
- Inline editing and bulk operations
- CSV and PDF export

### Recurring Transactions
- Automate regular income and expenses
- Flexible scheduling (daily, weekly, monthly, yearly)
- Custom intervals (e.g., every 2 weeks)
- Automatic transaction creation via cron jobs
- Start/end date configuration

### Budgets & Alerts
- Set spending limits by category
- Real-time spending tracking
- Visual progress indicators (green/amber/red)
- Automatic alerts at 80% and 100%
- Monthly and yearly budget periods

### Reports & Analytics
- Interactive charts (spending trends, category donut, income vs. expenses)
- Period-over-period comparison
- Customizable date ranges
- Export reports as PDF or CSV

### Team Collaboration
- Multi-user organizations
- Role-based permissions (Owner, Admin, Member)
- Email invitations with secure tokens
- Real-time updates across team members via Supabase realtime

### Performance & UX
- Code splitting and lazy loading per route
- React Query with localStorage persistence for offline-first data
- Skeleton loaders for perceived performance
- Global toast notifications for all errors and actions
- Dark mode with persistence
- Command palette (Cmd+K)
- Framer Motion animations

### Security
- Clerk authentication with JWT (frontend + backend)
- Row Level Security (RLS) in Supabase
- Helmet security headers + CORS
- Rate limiting (300 req/15min read, 100 req/15min write)
- Input validation with Zod (frontend + backend)
- Idempotency keys for safe retries
- Error tracking with Sentry

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm
- Accounts for:
  - [Supabase](https://supabase.com) (database)
  - [Clerk](https://clerk.com) (authentication)
  - [Resend](https://resend.com) (email)
  - [Sentry](https://sentry.io) (optional - error tracking)
  - [PostHog](https://posthog.com) (optional - analytics)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter.git
cd expense-tracker-starter
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. **Set up environment variables**

Create `.env.local` in the root:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_xxxxx
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Create `server/.env`:
```env
PORT=3001
CLERK_SECRET_KEY=sk_test_xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxx
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://your-frontend-domain.vercel.app
```

4. **Set up the database**

Run migrations in Supabase SQL editor (in order from `supabase/migrations/`) or use the CLI:
```bash
supabase db push
```

5. **Start development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd server
npm run dev
```

6. **Open the app**

Visit http://localhost:5173

## Project Structure

```
expense-tracker-starter/
├── src/                          # React frontend (TypeScript)
│   ├── pages/                   # Route-level page components (lazy loaded)
│   │   ├── dashboard/           # Dashboard with metrics, charts, live feed
│   │   ├── transactions/        # Transaction management with filters
│   │   ├── budgets/             # Budget tracking with health indicators
│   │   ├── recurring/           # Recurring transaction management
│   │   ├── team/                # Team & organization management
│   │   ├── reports/             # Analytics and reporting
│   │   ├── settings/            # User and org settings
│   │   ├── landing/             # Public landing page
│   │   └── legal/               # Terms, privacy, FAQ, contact
│   ├── components/              # Shared components
│   │   ├── layout/              # AppLayout, SideNav, TopNav, AppFooter
│   │   ├── shared/              # PageHeader, StatCard
│   │   ├── stitch/              # Design system components
│   │   ├── Toast.tsx            # Toast notification component
│   │   ├── ToastContainer.tsx   # Toast provider and context
│   │   ├── QueryErrorHandler.tsx # Global error → toast handler
│   │   ├── ErrorBoundary.tsx    # React error boundary with Sentry
│   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   └── ...                  # Modals, forms, charts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTransactions.js   # React Query-based transaction CRUD
│   │   ├── useBudgets.js        # React Query-based budget management
│   │   ├── useOrganization.js   # Organization state
│   │   └── useTransactionFilters.ts # Filter/sort state
│   ├── integration/             # Typed integration layer
│   │   ├── api/apiClient.ts     # Typed API client with error emission
│   │   ├── auth/clerk.ts        # Clerk auth utilities
│   │   ├── hooks/               # Typed hooks (useOrganization, useRealtime)
│   │   ├── cache/cache.ts       # Cache management
│   │   └── monitoring/sentry.ts # Sentry initialization
│   ├── lib/                     # Core utilities
│   │   ├── apiClient.js         # API client with global error bus
│   │   ├── queryClient.js       # React Query client + persister
│   │   ├── supabase.js          # Supabase client
│   │   ├── cache.js             # In-memory cache with TTL
│   │   ├── exportUtils.js       # PDF/CSV export
│   │   └── validation.ts        # Zod schemas
│   ├── types/                   # TypeScript type definitions
│   ├── router.tsx               # Route config with lazy loading
│   ├── main.tsx                 # App entry (Clerk, React Query, Sentry, PostHog)
│   ├── constants.js             # App constants (categories, currencies)
│   └── index.css                # Tailwind + global styles
├── server/                       # Express backend (Node.js)
│   ├── routes/                  # API route handlers
│   │   ├── organizations.js     # Organization CRUD
│   │   ├── transactions.js      # Transaction CRUD
│   │   ├── budgets.js           # Budget CRUD
│   │   ├── members.js           # Member management
│   │   ├── invitations.js       # Invitation system
│   │   └── recurringTransactions.js # Recurring transaction CRUD
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # Clerk JWT verification
│   │   ├── idempotency.js       # Safe retry support
│   │   └── orgAccess.js         # Organization-level access control
│   ├── lib/                     # Backend utilities
│   │   ├── supabase.js          # Supabase admin client
│   │   ├── email.js             # Resend email service
│   │   ├── scheduler.js         # Cron job scheduler
│   │   ├── recurringProcessor.js # Process recurring transactions
│   │   ├── logger.js            # Logging utility
│   │   ├── auditLog.js          # Audit logging
│   │   └── validation.js        # Zod request validation
│   ├── docs/openapi.json        # OpenAPI/Swagger spec
│   └── index.js                 # Server entry (Express, CORS, rate limiting)
├── supabase/migrations/          # Database migrations (9 tables + RLS)
├── e2e/                          # Playwright E2E tests
├── .github/workflows/            # CI (E2E tests)
├── docs/                         # Documentation
├── public/                       # Static assets
├── vercel.json                   # Vercel deployment config
├── vite.config.ts                # Vite build config with code splitting
├── tailwind.config.js            # Tailwind with custom design tokens
├── playwright.config.js          # E2E test config
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Tech Stack

### Frontend
- **React 19** with TypeScript 6
- **Vite 8** - Build tool with optimized chunking
- **React Router 7** - Routing with lazy loading
- **React Query 5** - Data fetching, caching, and offline persistence
- **Tailwind CSS 3** - Utility-first CSS with custom design tokens
- **Recharts** - Interactive data visualization
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **Clerk** - Authentication and user management
- **jsPDF + html2canvas** - PDF generation
- **Zod** - Runtime validation

### Backend
- **Express 5** - REST API server
- **Supabase** - PostgreSQL with Row Level Security and realtime
- **Clerk SDK** - JWT token verification
- **Resend** - Transactional email
- **node-cron** - Scheduled task execution
- **Helmet** - Security headers
- **express-rate-limit** - API rate limiting
- **Swagger UI** - Interactive API docs (dev mode)
- **Zod** - Request validation

### Monitoring & Analytics
- **Sentry** - Error tracking and performance monitoring
- **PostHog** - Product analytics and session recording

### Testing
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **GitHub Actions** - CI pipeline

## Available Scripts

### Frontend
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run unit tests (Vitest)
npx playwright test  # Run E2E tests
```

### Backend
```bash
cd server
npm run dev          # Start with nodemon (hot reload)
npm start            # Start for production
```

## API Endpoints

All endpoints require Clerk JWT authentication via `Authorization: Bearer <token>` header.

| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/organizations` | Organization CRUD |
| GET | `/api/organizations/me` | Get current user's org |
| GET/POST/PUT/DELETE | `/api/transactions` | Transaction CRUD |
| GET/POST/PUT/DELETE | `/api/budgets` | Budget CRUD |
| GET/POST/PUT/DELETE | `/api/recurring-transactions` | Recurring transaction CRUD |
| GET | `/api/members` | List organization members |
| POST/DELETE | `/api/invitations` | Manage team invitations |

Interactive API docs available at `/api/docs` in development mode.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Frontend (Vercel)                              │
│  React 19 + TypeScript + React Query + Realtime │
└──────────────────────┬──────────────────────────┘
                       │ REST API (Bearer JWT)
┌──────────────────────▼──────────────────────────┐
│  Backend API (Render)                           │
│  Express 5 + Clerk JWT + Rate Limiting + Helmet │
└──────────────────────┬──────────────────────────┘
                       │ Supabase Admin Client
┌──────────────────────▼──────────────────────────┐
│  Database (Supabase)                            │
│  PostgreSQL + RLS + Realtime + 9 tables         │
└─────────────────────────────────────────────────┘
```

### Error Handling
- Global `QueryErrorHandler` auto-toasts all failed queries
- API client error bus surfaces errors from realtime hooks and manual fetches
- Status-specific messages (429, 401, 403, 5xx) for user clarity
- Deduplication prevents toast spam on rapid failures
- Sentry captures all errors with user context
- React `ErrorBoundary` catches render crashes

### Data Flow
- React Query manages server state with 5-minute staleness and localStorage persistence
- Supabase realtime subscriptions for live updates across team members
- Automatic fallback to 30-second polling when WebSocket fails
- In-memory cache with configurable TTL for frequently accessed data

### Code Splitting
- Route-based splitting with `React.lazy()`
- Vendor chunks: react-vendor, clerk-vendor, chart-vendor, pdf-vendor, supabase-vendor, monitoring-vendor
- Per-page chunks: 3-22 KB each (gzipped)

## Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

Configured via `vercel.json` with SPA rewrites, security headers, and API proxying.

### Backend (Render)
Deploy as a Node.js web service pointing to the `server/` directory.

Environment variables must be set on both platforms. See [Deployment Guide](./docs/DEPLOYMENT.md) for details.

## Troubleshooting

### Common Issues

**Rate limit errors (429)**:
- The API allows 300 requests per 15 minutes for reads
- If hitting limits, the frontend will show a toast: "Too many requests. Please wait a moment and try again."

**Port already in use**:
```bash
npx kill-port 3001
```

**Database connection failed**:
- Check Supabase project status
- Verify environment variables match your Supabase project
- Ensure RLS policies are enabled

**Authentication errors**:
- Verify Clerk keys are correct for your environment
- Check redirect URLs in Clerk dashboard
- Clear browser cache and cookies

**Build failures**:
```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

## Documentation

- [User Guide](./docs/USER_GUIDE.md) - Complete user documentation
- [API Documentation](./docs/API_DOCUMENTATION.md) - API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Vercel Guide](./docs/VERCEL_DEPLOYMENT.md) - Vercel-specific steps
- [Monitoring Guide](./docs/MONITORING.md) - Sentry & PostHog setup
- [Design System](./docs/DESIGN.md) - UI design reference
- [Contributing](./docs/CONTRIBUTING.md) - Contribution guidelines
- [Project Overview](./docs/PROJECT_OVERVIEW.md) - Full architecture deep-dive

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Muhammad Raed Siddiqui**
- GitHub: [@MuhammadRaedSiddiqui](https://github.com/MuhammadRaedSiddiqui)
- Project: [Finance Tracker](https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter)
