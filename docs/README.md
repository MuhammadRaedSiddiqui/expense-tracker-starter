# Documentation Index

Welcome to the Finance Tracker documentation. This folder contains all essential project documentation.

## 📚 Available Guides

### Core Documentation
- **[README.md](../README.md)** (root) - Project overview & quick start
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Full project documentation, architecture, features

### User & Developer Guides
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete user documentation, how to use the app
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Full API reference for backend development
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute, code style, PR process

### Deployment & Operations
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide (Supabase, Clerk, Resend, Vercel, Railway, etc.)
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Vercel-specific deployment (quick frontend deploy)
- **[MONITORING.md](./MONITORING.md)** - Sentry error tracking & PostHog analytics setup

### Design
- **[DESIGN.md](./DESIGN.md)** - Design system, UI principles, component library

## 🗂️ Project Structure

```
docs/
├── README.md                    # This index
├── API_DOCUMENTATION.md         # API reference
├── USER_GUIDE.md                # User guide
├── DEPLOYMENT.md                # Full deployment (all services)
├── VERCEL_DEPLOYMENT.md         # Vercel quick deploy
├── MONITORING.md                # Sentry + PostHog
├── DESIGN.md                    # Design system
├── CONTRIBUTING.md              # Contributing guide
└── PROJECT_DOCUMENTATION.md     # Full project docs
```

## 🗑️ Archived Files

Historical reports, test logs, and temporary documentation have been moved to `trash/` folder for manual review and deletion:

- Bug reports (BUG-*.md)
- E2E testing summaries (E2E_*.md)
- QA test plans (QA_*.md)
- Testing execution reports (TEST_*.md)
- Stitch migration notes (STITCH_*.md)
- Redesign notes (REDESIGN_*.md)
- UI audit reports
- Build artifacts (dist/, test-results/, playwright-report/)
- Logs (test-run-full.log, etc.)

The `trash/` folder can be safely deleted after review.

## 🔗 Related Files (Root)

- `../README.md` - Main project README
- `../CLAUDE.md` - Guidance for Claude Code
- `../package.json` - Dependencies & scripts
- `../vercel.json` - Vercel config
