# Documentation Index

Welcome to the expense tracker documentation. This index will help you find the information you need.

## Getting Started

- **[Development Guide](DEVELOPMENT.md)** - Set up your local development environment
- **[Architecture Overview](ARCHITECTURE.md)** - Understand the system architecture

## For Developers

### Core Documentation
- **[API Reference](API_REFERENCE.md)** - Complete API endpoint documentation
- **[Database Schema](DATABASE_SCHEMA.md)** - Database structure and relationships
- **[Testing Guide](TESTING.md)** - Testing strategies and best practices

### Deployment & Operations
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](SECURITY.md)** - Security practices and vulnerability reporting

## Quick Links

### Development
```bash
# Start development servers
npm run dev                    # Frontend (http://localhost:5173)
cd server && npm run dev       # Backend (http://localhost:3001)

# Run tests
npm test                       # Frontend tests
cd server && npm test          # Backend tests

# Lint code
npm run lint
```

### Common Tasks
- [Adding a new component](DEVELOPMENT.md#adding-a-new-component)
- [Adding a new API endpoint](DEVELOPMENT.md#adding-a-new-api-endpoint)
- [Creating a database migration](DEVELOPMENT.md#adding-a-database-table)
- [Writing tests](TESTING.md)

## Architecture at a Glance

```
Frontend (React + Vite)
    ↓ REST API + JWT
Backend (Express)
    ↓ SQL Queries
Database (Supabase PostgreSQL)
```

**Key Technologies:**
- Frontend: React, Vite, TanStack Query, React Router 7
- Backend: Node.js, Express, Node-Cron
- Database: Supabase (PostgreSQL + Real-time)
- Auth: Clerk
- Email: Resend
- Monitoring: Sentry, PostHog

## Project Structure

```
expense-tracker-starter/
├── docs/              # Documentation (you are here)
├── server/            # Backend application
├── src/               # Frontend application
├── public/            # Static assets
└── .claude/           # Claude Code configuration
```

## Need Help?

- **Bug Reports**: Create an issue on GitHub
- **Feature Requests**: Create an issue with the "enhancement" label
- **Security Issues**: See [Security Policy](SECURITY.md)
- **Questions**: Check existing issues or create a new discussion

## Documentation Maintenance

This documentation is maintained alongside the code. When making changes:

1. Update relevant documentation files
2. Keep code examples up to date
3. Update the changelog for significant changes
4. Review documentation in pull requests

Last updated: 2026-04-29
