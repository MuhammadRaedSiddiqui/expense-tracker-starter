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

Single-component React app with no routing or external state management:
- All logic lives in `src/App.jsx` (useState for state management)
- No data persistence - state resets on page refresh
- Hardcoded initial transactions and categories
- Standard Vite + React setup

## Known Issues (Intentional)

This codebase intentionally contains:
- Bugs in the logic (e.g., type mismatches, calculation errors)
- Poor UI/UX design
- Messy code structure (everything in one component)
- No data validation or error handling
- Amount values stored as strings but used in numeric calculations

These issues are part of the learning experience and should be addressed as part of course exercises.
