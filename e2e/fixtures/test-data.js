/**
 * Test data fixtures for E2E tests
 */

export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    role: 'admin',
  },
  member: {
    email: 'member@example.com',
    password: 'MemberPassword123!',
    role: 'member',
  },
};

export const testTransactions = {
  income: [
    {
      description: 'Monthly Salary',
      amount: '5000',
      type: 'income',
      category: 'salary',
      currency: 'USD',
      date: '2026-04-01',
    },
    {
      description: 'Freelance Project',
      amount: '1500',
      type: 'income',
      category: 'freelance',
      currency: 'USD',
      date: '2026-04-05',
    },
    {
      description: 'Investment Returns',
      amount: '300',
      type: 'income',
      category: 'investment',
      currency: 'USD',
      date: '2026-04-10',
    },
  ],
  expenses: [
    {
      description: 'Rent Payment',
      amount: '1200',
      type: 'expense',
      category: 'housing',
      currency: 'USD',
      date: '2026-04-01',
    },
    {
      description: 'Grocery Shopping',
      amount: '250',
      type: 'expense',
      category: 'food',
      currency: 'USD',
      date: '2026-04-03',
    },
    {
      description: 'Electric Bill',
      amount: '120',
      type: 'expense',
      category: 'utilities',
      currency: 'USD',
      date: '2026-04-05',
    },
    {
      description: 'Gas Station',
      amount: '60',
      type: 'expense',
      category: 'transport',
      currency: 'USD',
      date: '2026-04-07',
    },
    {
      description: 'Netflix Subscription',
      amount: '15',
      type: 'expense',
      category: 'entertainment',
      currency: 'USD',
      date: '2026-04-08',
    },
    {
      description: 'Doctor Visit',
      amount: '80',
      type: 'expense',
      category: 'healthcare',
      currency: 'USD',
      date: '2026-04-12',
    },
  ],
};

export const testBudgets = [
  {
    category: 'food',
    amount: '500',
    period: 'monthly',
    currency: 'USD',
  },
  {
    category: 'transport',
    amount: '200',
    period: 'monthly',
    currency: 'USD',
  },
  {
    category: 'entertainment',
    amount: '150',
    period: 'monthly',
    currency: 'USD',
  },
  {
    category: 'utilities',
    amount: '300',
    period: 'monthly',
    currency: 'USD',
  },
];

export const testRecurringTransactions = [
  {
    description: 'Monthly Rent',
    amount: '1200',
    type: 'expense',
    category: 'housing',
    frequency: 'monthly',
    interval: '1',
    currency: 'USD',
  },
  {
    description: 'Weekly Groceries',
    amount: '100',
    type: 'expense',
    category: 'food',
    frequency: 'weekly',
    interval: '1',
    currency: 'USD',
  },
  {
    description: 'Bi-weekly Salary',
    amount: '2500',
    type: 'income',
    category: 'salary',
    frequency: 'weekly',
    interval: '2',
    currency: 'USD',
  },
  {
    description: 'Annual Insurance',
    amount: '1200',
    type: 'expense',
    category: 'other',
    frequency: 'yearly',
    interval: '1',
    currency: 'USD',
  },
];

export const testCategories = {
  income: ['salary', 'freelance', 'investment', 'gift', 'other'],
  expense: [
    'food',
    'housing',
    'utilities',
    'transport',
    'entertainment',
    'healthcare',
    'shopping',
    'other',
  ],
};

export const testCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const testDateRanges = {
  thisMonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split('T')[0],
  },
  lastMonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      .toISOString()
      .split('T')[0],
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      .toISOString()
      .split('T')[0],
  },
  thisYear: {
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
  },
};

/**
 * Generate random transaction data
 */
export function generateRandomTransaction(type = 'expense') {
  const categories = type === 'income' ? testCategories.income : testCategories.expense;
  const category = categories[Math.floor(Math.random() * categories.length)];

  return {
    description: `Test ${type} ${Date.now()}`,
    amount: String(Math.floor(Math.random() * 1000) + 10),
    type,
    category,
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Generate bulk transaction data
 */
export function generateBulkTransactions(count = 10) {
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.5 ? 'income' : 'expense';
    transactions.push(generateRandomTransaction(type));
  }

  return transactions;
}
