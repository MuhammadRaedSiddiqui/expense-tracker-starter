# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a starter project for a Claude Code course - an intentionally flawed expense tracker app built with React. The codebase has deliberate bugs, poor UI, and messy code that are meant to be fixed throughout the course.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

Modular React app with component-based structure:
- `src/App.jsx` - Main component managing state, handlers, and composition
- `src/constants.js` - Centralized constants (categories, transaction types, initial data)
- `src/utils.js` - Utility functions (currency formatting, date formatting)
- `src/components/` - All React components organized in dedicated folder:
  - `Summary.jsx` - Displays income, expenses, and balance with calculation logic
  - `TransactionForm.jsx` - Form for adding new transactions with validation
  - `TransactionList.jsx` - Container for transaction display and filtering
  - `TransactionTable.jsx` - Table component for rendering transactions with edit/delete actions
  - `TransactionFilters.jsx` - Filter controls for type and category
  - `EditTransactionForm.jsx` - Inline form for editing existing transactions
  - `FormInput.jsx` - Reusable input component
  - `FormSelect.jsx` - Reusable select dropdown component
- State management: useState and useEffect hooks in App.jsx
- Data persistence: localStorage for transactions
- No routing or external state management libraries
- Standard Vite + React setup

## Features

- ✓ Add new transactions (income/expense)
- ✓ Edit existing transactions inline
- ✓ Delete transactions
- ✓ Clear all data with confirmation
- ✓ Filter by transaction type (income/expense/all)
- ✓ Filter by category
- ✓ Filter by date range (start and end dates)
- ✓ Search transactions by description
- ✓ Sort by date, amount, or description
- ✓ Toggle sort order (ascending/descending)
- ✓ Multi-currency support (10 currencies with automatic conversion)
- ✓ Real-time exchange rates via API (frankfurter.app)
- ✓ Manual refresh for exchange rates
- ✓ Charts and visualizations (pie chart, line chart)
- ✓ Real-time balance calculation
- ✓ Data persistence with localStorage
- ✓ Form validation with error messages
- ✓ Currency formatting with proper symbols
- ✓ Date formatting
- ✓ Empty state message
- ✓ Accessibility features (ARIA labels, roles)
- ✓ Responsive design
- ✓ Modern UI with gradient theme
- ✓ Dark mode toggle with persistence

## Fixed Issues

The following issues have been resolved:
- ✓ Calculation bugs fixed (amounts properly parsed with parseFloat)
- ✓ Freelance Work transaction type corrected from expense to income
- ✓ Code refactored into modular, reusable components
- ✓ Separation of concerns (calculation logic in Summary, filtering in TransactionList)
- ✓ Components organized in dedicated folder structure
- ✓ Delete functionality implemented
- ✓ Edit functionality implemented
- ✓ localStorage persistence added
- ✓ Constants extracted to separate file
- ✓ Form validation and error handling added
- ✓ Modern UI/UX design with gradient theme
- ✓ Currency and date formatting utilities
- ✓ Empty state for better UX
- ✓ Accessibility improvements (ARIA labels, semantic HTML)
- ✓ Responsive design with media queries
- ✓ Clear all data functionality
- ✓ Dark mode toggle with localStorage persistence
- ✓ **Phase 0 Complete:** Supabase database deployed, Sentry + PostHog monitoring active

## Phase 0: Foundation & Setup - ✅ COMPLETE

All infrastructure and monitoring systems are configured and operational. See `PHASE_0_COMPLETE.md` for detailed completion report.

**Key Achievements:**
- Supabase database deployed with 9 tables and RLS policies
- Sentry error tracking active and tested
- PostHog analytics active with event confirmation
- Environment variables configured
- API structure ready for Phase 1
- Vercel deployment configuration complete
