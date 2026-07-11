import { Minus, ArrowUp, ArrowDown, AlertTriangle, AlertCircle, MoreVertical } from 'lucide-react';

interface Transaction {
  id: string;
  merchant: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
  iconBg: string;
  categoryBg: string;
  categoryText: string;
}

export function LedgerDashboard() {
  const transactions: Transaction[] = [
    {
      id: '1',
      merchant: 'Apple Store Downtown',
      description: 'Cloud Storage Subscription',
      category: 'Subscriptions',
      date: 'Sept 12, 2023',
      amount: -9.99,
      type: 'expense',
      icon: 'shopping_bag',
      iconBg: 'bg-secondary-container text-primary',
      categoryBg: 'bg-surface-container-high',
      categoryText: 'text-slate-600',
    },
    {
      id: '2',
      merchant: 'Stripe Payout',
      description: 'Freelance Invoice #992',
      category: 'Work Income',
      date: 'Sept 10, 2023',
      amount: 2450.0,
      type: 'income',
      icon: 'payments',
      iconBg: 'bg-green-100 text-green-700',
      categoryBg: 'bg-green-50',
      categoryText: 'text-green-700',
    },
    {
      id: '3',
      merchant: 'The Blue Oyster',
      description: 'Client Dinner',
      category: 'Dining',
      date: 'Sept 08, 2023',
      amount: -142.5,
      type: 'expense',
      icon: 'restaurant',
      iconBg: 'bg-amber-100 text-amber-700',
      categoryBg: 'bg-amber-50',
      categoryText: 'text-amber-700',
    },
    {
      id: '4',
      merchant: 'Modern Management',
      description: 'Monthly Rent Payment',
      category: 'Housing',
      date: 'Sept 01, 2023',
      amount: -2100.0,
      type: 'expense',
      icon: 'home',
      iconBg: 'bg-slate-100 text-slate-600',
      categoryBg: 'bg-slate-200',
      categoryText: 'text-slate-600',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Summary Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-label uppercase tracking-widest opacity-70">
              Total Balance
            </p>
            <h3 className="text-[3.5rem] font-bold leading-none mt-2 tracking-tighter">
              $42,950.40
            </h3>
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-md">
              <Minus className="w-4 h-4 mr-1" />
              Stable this month
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Income Card */}
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-transparent flex flex-col justify-between">
          <div>
            <p className="text-sm font-label uppercase tracking-widest text-slate-500">
              Total Income
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">$12,400.00</h3>
          </div>
          <div className="mt-6 flex items-center text-green-600 font-semibold">
            <ArrowUp className="w-5 h-5 mr-1" />
            14% Increase vs last month
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-transparent flex flex-col justify-between">
          <div>
            <p className="text-sm font-label uppercase tracking-widest text-slate-500">
              Total Expenses
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">$8,120.25</h3>
          </div>
          <div className="mt-6 flex items-center text-error font-semibold">
            <ArrowDown className="w-5 h-5 mr-1" />
            8% Increase vs last month
          </div>
        </div>
      </section>

      {/* Budget Alerts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-xl flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mr-4 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900">Budget Warning: Travel</h4>
            <p className="text-sm text-amber-800 mt-1">
              You have reached 85% of your $1,200 monthly budget for Travel & Leisure.
            </p>
          </div>
        </div>
        <div className="bg-error-container/30 border-l-4 border-error p-6 rounded-xl flex items-start">
          <AlertCircle className="w-5 h-5 text-error mr-4 mt-1" />
          <div>
            <h4 className="font-bold text-error">Limit Exceeded: Dining</h4>
            <p className="text-sm text-on-error-container mt-1">
              You are $125 over your $600 dining budget for September.
            </p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-12 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold">Income vs Expenses</h4>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-surface-container-low rounded-md text-xs font-semibold cursor-pointer">
                6M
              </span>
              <span className="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold cursor-pointer">
                1Y
              </span>
            </div>
          </div>
          <div className="flex-1 relative flex items-end justify-between space-x-4 pt-10">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
              const heights = [
                { income: 60, expense: 40 },
                { income: 75, expense: 50 },
                { income: 65, expense: 55 },
                { income: 90, expense: 45 },
                { income: 80, expense: 60 },
                { income: 70, expense: 35 },
              ];
              return (
                <div key={month} className="flex-1 flex flex-col justify-end group">
                  <div
                    className="w-full bg-secondary-container rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${heights[idx].income}%` }}
                  ></div>
                  <div
                    className="w-full bg-primary-container rounded-t-lg -mt-4 transition-all duration-300 group-hover:opacity-80"
                    style={{ height: `${heights[idx].expense}%` }}
                  ></div>
                  <span className="text-[10px] text-center mt-2 text-slate-400 font-label uppercase">
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Progress Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl h-full">
            <h4 className="text-xl font-bold mb-6">Budget Overview</h4>
            <div className="space-y-8">
              {[
                { name: 'Housing', current: 2400, total: 2500, color: 'bg-primary', percent: 96 },
                { name: 'Groceries', current: 640, total: 800, color: 'bg-secondary', percent: 80 },
                { name: 'Entertainment', current: 320, total: 400, color: 'bg-tertiary', percent: 80 },
                { name: 'Utilities', current: 180, total: 250, color: 'bg-slate-400', percent: 72 },
              ].map((budget) => (
                <div key={budget.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{budget.name}</span>
                    <span className="text-slate-500">
                      ${budget.current} / ${budget.total}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${budget.color}`} style={{ width: `${budget.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transaction List Section */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {/* Filter Bar */}
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center bg-surface-container-low/50 gap-4">
          <h4 className="text-xl font-bold">Recent Transactions</h4>
          <div className="flex items-center space-x-4">
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary cursor-pointer">
              <option>All Types</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Category</option>
              <option>Housing</option>
              <option>Dining</option>
            </select>
            <button className="px-6 py-2 bg-surface-container-lowest text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors">
              Filters
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low/30 text-xs font-label uppercase tracking-widest text-slate-500">
            <div className="col-span-5">Merchant / Description</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {transactions.map((transaction, idx) => (
            <div
              key={transaction.id}
              className={`grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-surface-container-low transition-colors group ${
                idx % 2 === 1 ? 'bg-surface-container-low/10' : ''
              }`}
            >
              <div className="col-span-5 flex items-center">
                <div className={`w-12 h-12 rounded-full ${transaction.iconBg} flex items-center justify-center`}>
                  <span className="text-xl">{transaction.icon === 'shopping_bag' ? '🛍️' : transaction.icon === 'payments' ? '💳' : transaction.icon === 'restaurant' ? '🍽️' : '🏠'}</span>
                </div>
                <div className="ml-4">
                  <h5 className="text-base font-semibold text-slate-900">
                    {transaction.merchant}
                  </h5>
                  <p className="text-sm text-slate-500">{transaction.description}</p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className={`px-3 py-1 ${transaction.categoryBg} rounded-full text-[10px] font-bold uppercase ${transaction.categoryText}`}>
                  {transaction.category}
                </span>
              </div>
              <div className="col-span-2 text-center text-sm text-slate-500">
                {transaction.date}
              </div>
              <div className="col-span-2 text-right">
                <span className={`text-base font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-error'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 flex justify-between items-center text-sm text-slate-500 bg-surface-container-low/20">
          <span>Showing 1 to 4 of 124 transactions</span>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
