export const CATEGORIES = {
  income: ['salary', 'freelance', 'investment', 'gift', 'other'],
  expense: ['food', 'housing', 'utilities', 'transport', 'entertainment', 'healthcare', 'shopping', 'other'],
};

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const FILTER_ALL = 'all';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
];

export const BASE_CURRENCY = 'USD';

// Exchange rates relative to USD (1 USD = X currency)
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.08,
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    description: 'Salary',
    amount: 5000,
    type: 'income',
    category: 'salary',
    date: '2025-01-01',
    currency: 'USD',
  },
  {
    id: 2,
    description: 'Rent',
    amount: 1200,
    type: 'expense',
    category: 'housing',
    date: '2025-01-02',
    currency: 'USD',
  },
  {
    id: 3,
    description: 'Groceries',
    amount: 150,
    type: 'expense',
    category: 'food',
    date: '2025-01-03',
    currency: 'USD',
  },
  {
    id: 4,
    description: 'Freelance Work',
    amount: 800,
    type: 'income',
    category: 'salary',
    date: '2025-01-05',
    currency: 'USD',
  },
  {
    id: 5,
    description: 'Electric Bill',
    amount: 95,
    type: 'expense',
    category: 'utilities',
    date: '2025-01-06',
    currency: 'USD',
  },
  {
    id: 6,
    description: 'Dinner Out',
    amount: 65,
    type: 'expense',
    category: 'food',
    date: '2025-01-07',
    currency: 'USD',
  },
  {
    id: 7,
    description: 'Gas',
    amount: 45,
    type: 'expense',
    category: 'transport',
    date: '2025-01-08',
    currency: 'USD',
  },
  {
    id: 8,
    description: 'Netflix',
    amount: 15,
    type: 'expense',
    category: 'entertainment',
    date: '2025-01-10',
    currency: 'USD',
  },
];

export const STORAGE_KEY = 'transactions';
