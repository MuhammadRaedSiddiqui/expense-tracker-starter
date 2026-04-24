import { useMemo } from 'react';
import type { Transaction } from '@/types';

interface PeriodComparisonProps {
  transactions: Transaction[];
}

export default function PeriodComparison({ transactions }: PeriodComparisonProps) {
  const comparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTotal = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const lastMonthTotal = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          date.getMonth() === lastMonth &&
          date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const change = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    return {
      currentMonth: new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' }),
      lastMonth: new Date(lastMonthYear, lastMonth).toLocaleDateString('en-US', { month: 'long' }),
      currentMonthTotal,
      lastMonthTotal,
      change,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="col-span-12 bg-surface-container-lowest p-8 border border-outline-variant/10 rounded-xl">
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">
          Month-over-Month
        </span>
        <h3 className="text-xl font-bold tracking-tight">Period Comparison</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container p-6 rounded-lg">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            {comparison.currentMonth}
          </p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(comparison.currentMonthTotal)}</p>
        </div>
        <div className="bg-surface-container p-6 rounded-lg">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            {comparison.lastMonth}
          </p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(comparison.lastMonthTotal)}</p>
        </div>
        <div className="bg-surface-container p-6 rounded-lg">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Change
          </p>
          <p
            className={`text-2xl font-black tabular-nums ${
              comparison.change > 0 ? 'text-error' : comparison.change < 0 ? 'text-secondary' : 'text-on-surface'
            }`}
          >
            {comparison.change > 0 ? '+' : ''}
            {comparison.change.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
