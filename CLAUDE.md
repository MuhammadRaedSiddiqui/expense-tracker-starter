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
- `src/App.jsx` - Main component managing state and composition
- `src/Summary.jsx` - Displays income, expenses, and balance with calculation logic
- `src/TransactionForm.jsx` - Form for adding new transactions
- `src/TransactionList.jsx` - Container for transaction display and filtering
- `src/TransactionTable.jsx` - Table component for rendering transactions
- `src/TransactionFilters.jsx` - Filter controls for type and category
- `src/FormInput.jsx` - Reusable input component
- `src/FormSelect.jsx` - Reusable select dropdown component
- State management: useState hooks in App.jsx
- No routing or external state management libraries
- No data persistence - state resets on page refresh
- Standard Vite + React setup

## Fixed Issues

The following issues have been resolved:
- ✓ Calculation bugs fixed (amounts properly parsed with parseFloat)
- ✓ Freelance Work transaction type corrected from expense to income
- ✓ Code refactored into modular, reusable components
- ✓ Separation of concerns (calculation logic in Summary, filtering in TransactionList)

## Remaining Issues

This codebase still contains:
- Poor UI/UX design
- No data persistence (localStorage, database)
- No data validation or error handling
- No delete or edit functionality for transactions
- No tests
