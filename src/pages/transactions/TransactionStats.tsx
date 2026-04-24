import { useMemo } from 'react';
import type { Transaction } from '@/types';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export default function TransactionStats({ transactions }: TransactionStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter current month transactions
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Calculate monthly burn rate (expenses only)
    const monthlyBurn = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Calculate average transaction amount
    const avgTransaction =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) /
          transactions.length
        : 0;

    // Find top category by spending
    const categorySpending = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categorySpending.get(t.category) || 0;
        categorySpending.set(t.category, current + parseFloat(t.amount.toString()));
      });

    const topCategory = Array.from(categorySpending.entries()).sort((a, b) => b[1] - a[1])[0];

    const totalExpenses = Array.from(categorySpending.values()).reduce((sum, val) => sum + val, 0);
    const topCategoryPercentage = topCategory
      ? Math.round((topCategory[1] / totalExpenses) * 100)
      : 0;

    return {
      monthlyBurn,
      avgTransaction,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      topCategoryPercentage,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-error-container -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-error-container/80 transition-colors"></div>
        <div className="relative">
          <p className="text-[11px] font-bold tracking-widest text-outline uppercase mb-2">
            Monthly Burn Rate
          </p>
          <h3 className="text-2xl font-bold text-on-surface font-mono">
            {formatCurrency(stats.monthlyBurn)}
          </h3>
          <div className="flex items-center gap-1 text-error text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">
              trending_up
            </span>
            Current month
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-primary-container/80 transition-colors"></div>
        <div className="relative">
          <p className="text-[11px] font-bold tracking-widest text-outline uppercase mb-2">
            Average Transaction
          </p>
          <h3 className="text-2xl font-bold text-on-surface font-mono">
            {formatCurrency(stats.avgTransaction)}
          </h3>
          <div className="flex items-center gap-1 text-secondary text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[16px]" data-icon="remove">
              remove
            </span>
            All time
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-tertiary-container/80 transition-colors"></div>
        <div className="relative">
          <p className="text-[11px] font-bold tracking-widest text-outline uppercase mb-2">
            Top Category
          </p>
          <h3 className="text-2xl font-bold text-on-surface capitalize">{stats.topCategory}</h3>
          <div className="mt-2 w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-tertiary h-full"
              style={{ width: `${stats.topCategoryPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs font-bold text-on-surface-variant mt-2">
            <span className="font-mono">{stats.topCategoryPercentage}%</span> of total
          </p>
        </div>
      </div>
    </div>
  );
}
