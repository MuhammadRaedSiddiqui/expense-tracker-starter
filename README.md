# Expense Tracker

A modern, feature-rich expense tracker application built with React. Track your income and expenses with a beautiful, responsive interface.

![Expense Tracker](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- ✅ **Add Transactions** - Record income and expenses with descriptions, amounts, and categories
- ✅ **Edit Transactions** - Modify existing transactions inline
- ✅ **Delete Transactions** - Remove individual transactions or clear all data
- ✅ **Smart Filtering** - Filter by transaction type (income/expense) and category
- ✅ **Real-time Calculations** - Automatic balance, income, and expense totals
- ✅ **Data Persistence** - Transactions saved to localStorage
- ✅ **Form Validation** - Input validation with helpful error messages
- ✅ **Currency Formatting** - Professional USD currency display
- ✅ **Date Formatting** - Human-readable date formats
- ✅ **Empty State** - Helpful message when no transactions exist
- ✅ **Accessibility** - ARIA labels and semantic HTML for screen readers
- ✅ **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ✅ **Modern UI** - Gradient theme with smooth animations and hover effects
- ✅ **Dark Mode** - Toggle between light and dark themes with persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter.git
cd expense-tracker-starter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Summary.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── TransactionTable.jsx
│   ├── TransactionFilters.jsx
│   ├── EditTransactionForm.jsx
│   ├── FormInput.jsx
│   └── FormSelect.jsx
├── constants.js         # App constants
├── utils.js            # Utility functions
├── App.jsx             # Main app component
├── App.css             # App styles
├── index.css           # Global styles
└── main.jsx            # Entry point
```

## Technologies Used

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **localStorage** - Client-side data persistence
- **CSS3** - Modern styling with gradients and animations

## Key Improvements

This project started as a basic expense tracker with intentional bugs and poor design. Through systematic refactoring, it has been transformed into a production-ready application:

### Code Quality
- Modular component architecture
- Separation of concerns
- Reusable components (FormInput, FormSelect)
- Constants extracted to dedicated file
- Utility functions for formatting

### Functionality
- Full CRUD operations (Create, Read, Update, Delete)
- Advanced filtering capabilities
- Data persistence with localStorage
- Form validation and error handling
- Clear all data with confirmation

### User Experience
- Modern gradient UI design
- Smooth animations and transitions
- Responsive layout for all devices
- Empty state messaging
- Currency and date formatting
- Accessibility features
- Dark mode with theme persistence

### Bug Fixes
- Fixed calculation errors (string to number conversion)
- Corrected transaction type mismatches
- Proper amount parsing with parseFloat

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

This project was created as part of a Claude Code course to demonstrate systematic code improvement and refactoring techniques.

## Contact

Muhammad Raed Siddiqui - [@MuhammadRaedSiddiqui](https://github.com/MuhammadRaedSiddiqui)

Project Link: [https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter](https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter)
