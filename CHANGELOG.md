# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation suite
  - Architecture diagram with Mermaid.js
  - API reference documentation
  - Database schema documentation
  - Deployment guide
  - Development guide
  - Testing guide
  - Security policy
  - Contributing guidelines

## [1.0.0] - 2026-04-29

### Added
- **Phase 0 Complete**: Foundation and infrastructure setup
  - Supabase database with 9 tables
  - Row Level Security (RLS) policies on all tables
  - Sentry error tracking integration
  - PostHog analytics integration
  - Environment configuration for production
  - Vercel deployment configuration

### Infrastructure
- Database tables: users, organizations, organization_members, transactions, budgets, recurring_transactions, invitations, notifications, audit_logs
- Real-time WebSocket support via Supabase
- Clerk authentication integration
- Resend email service integration
- Node-Cron scheduled tasks setup

## [0.9.0] - 2026-04-15

### Added
- Dark mode toggle with localStorage persistence
- Multi-currency support (10 currencies)
- Real-time exchange rate conversion via frankfurter.app API
- Manual refresh button for exchange rates
- Charts and visualizations (pie chart, line chart)
- Date range filtering (start and end dates)
- Search functionality for transaction descriptions
- Sort by date, amount, or description
- Toggle sort order (ascending/descending)

### Fixed
- Currency formatting with proper symbols
- Date formatting consistency
- Responsive design improvements

## [0.8.0] - 2026-04-01

### Added
- Clear all data functionality with confirmation dialog
- Empty state message when no transactions exist
- Accessibility improvements (ARIA labels, semantic HTML)
- Form validation with error messages
- Modern UI/UX design with gradient theme

### Changed
- Refactored code into modular components
- Extracted constants to separate file
- Improved component organization

## [0.7.0] - 2026-03-20

### Added
- Edit transaction functionality
- Inline editing form
- Delete transaction functionality
- localStorage persistence for transactions
- Filter by transaction type (income/expense/all)
- Filter by category

### Fixed
- Calculation bugs (proper parseFloat usage)
- Freelance Work transaction type corrected from expense to income

## [0.6.0] - 2026-03-10

### Added
- Transaction form with validation
- Category selection
- Transaction type selection (income/expense)
- Amount input with validation
- Description field
- Date picker

### Changed
- Component structure reorganized
- Separation of concerns (calculation logic, filtering logic)

## [0.5.0] - 2026-03-01

### Added
- Transaction list display
- Summary component (income, expenses, balance)
- Basic filtering functionality
- Transaction table component

## [0.4.0] - 2026-02-20

### Added
- Initial React component structure
- Basic state management with useState
- Constants file for categories and transaction types

## [0.3.0] - 2026-02-10

### Added
- Vite build configuration
- ESLint setup
- Basic CSS styling

## [0.2.0] - 2026-02-01

### Added
- Initial project setup with Vite
- React installation
- Basic project structure

## [0.1.0] - 2026-01-15

### Added
- Project initialization
- README with project description
- License file
- .gitignore configuration

---

## Version History Summary

- **v1.0.0** - Production-ready with full infrastructure (Phase 0 complete)
- **v0.9.0** - Multi-currency and advanced features
- **v0.8.0** - UI/UX improvements and accessibility
- **v0.7.0** - Edit/delete functionality and persistence
- **v0.6.0** - Transaction form and validation
- **v0.5.0** - Transaction list and summary
- **v0.4.0** - Initial React components
- **v0.3.0** - Build configuration
- **v0.2.0** - Project setup
- **v0.1.0** - Initial commit

---

## Upcoming Features (Roadmap)

### Phase 1: Backend API (Planned)
- [ ] Express REST API implementation
- [ ] Clerk authentication integration
- [ ] CRUD endpoints for transactions
- [ ] Organization management endpoints
- [ ] Budget management endpoints
- [ ] Invitation system endpoints

### Phase 2: Frontend Migration (Planned)
- [ ] Migrate from localStorage to API
- [ ] TanStack Query integration
- [ ] Real-time updates via WebSockets
- [ ] Organization switching
- [ ] Team collaboration features

### Phase 3: Advanced Features (Planned)
- [ ] Recurring transactions automation
- [ ] Budget alerts and notifications
- [ ] Advanced analytics and reports
- [ ] Export data (CSV, PDF)
- [ ] Mobile app (React Native)

---

## Breaking Changes

### v1.0.0
- Migration from localStorage to Supabase database
- Authentication now required (Clerk)
- Multi-tenancy with organizations

---

## Migration Guides

### Migrating from v0.x to v1.0
See [MIGRATION.md](MIGRATION.md) for detailed migration instructions.

---

## Contributors

Thank you to all contributors who have helped build this project!

- Initial development and architecture
- Bug fixes and improvements
- Documentation contributions
- Testing and QA

---

[Unreleased]: https://github.com/your-org/expense-tracker/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/expense-tracker/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/your-org/expense-tracker/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/your-org/expense-tracker/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/your-org/expense-tracker/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/your-org/expense-tracker/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/your-org/expense-tracker/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/your-org/expense-tracker/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/your-org/expense-tracker/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/your-org/expense-tracker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/your-org/expense-tracker/releases/tag/v0.1.0
