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
- ✓ Filter by transaction type (income/expense/all)
- ✓ Filter by category
- ✓ Real-time balance calculation
- ✓ Data persistence with localStorage
- ✓ Form validation with error messages

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

## Remaining Issues

This codebase still contains:
- Poor UI/UX design (basic styling, no responsive design)
- No tests (unit, integration, or e2e)
- No accessibility features (ARIA labels, keyboard navigation)
- No loading states or error boundaries
- No data export/import functionality
