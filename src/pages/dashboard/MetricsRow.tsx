import { useMemo } from 'react';
import StatCard from '@/components/shared/StatCard';
import { useBudgets } from '@/hooks/useBudgets';
import { useOrganization } from '@/integration/hooks/useOrganization';
import type { Transaction } from '@/types';

interface MetricsRowProps {
  transactions: Transaction[];
  isRealtime?: boolean;
}

export default function MetricsRow({ transactions, isRealtime }: MetricsRowProps) {
  const { organization } = useOrganization();
  const { budgets } = useBudgets(organization?.id);

  const metrics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const net = income - expenses;

    // Calculate month-over-month change (simplified - comparing to previous period)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const currentMonthIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const currentMonthExpenses = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Calculate budget totals
    const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0) || 0;

    // Calculate progress percentages
    let expenseProgress = 0;
    let incomeProgress = 0;

    if (totalBudget > 0) {
      // If we have budgets, calculate actual progress
      expenseProgress = Math.min((currentMonthExpenses / totalBudget) * 100, 100);
      incomeProgress = Math.min((currentMonthIncome / totalBudget) * 100, 100);
    } else if (currentMonthExpenses > 0 || currentMonthIncome > 0) {
      // If no budgets but we have transactions, show relative progress
      const maxAmount = Math.max(currentMonthExpenses, currentMonthIncome);
      if (maxAmount > 0) {
        expenseProgress = (currentMonthExpenses / maxAmount) * 100;
        incomeProgress = (currentMonthIncome / maxAmount) * 100;
      }
    }

    return {
      totalAssets: net,
      monthlyRevenue: currentMonthIncome,
      monthlyBurn: currentMonthExpenses,
      transactionCount: transactions.length,
      totalBudget,
      expenseProgress,
      incomeProgress,
    };
  }, [transactions, budgets]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Net Balance"
        value={formatCurrency(metrics.totalAssets)}
        icon="account_balance"
        iconColor="text-secondary"
        borderColor="border-secondary"
        trend={{
          value: isRealtime ? 'Live' : 'Static',
          label: `${metrics.transactionCount} transactions`,
          type: metrics.totalAssets >= 0 ? 'positive' : 'negative',
        }}
      />
      <StatCard
        label="Monthly Income"
        value={formatCurrency(metrics.monthlyRevenue)}
        icon="trending_up"
        iconColor="text-primary"
        progress={{
          value: metrics.incomeProgress,
          label: metrics.totalBudget > 0
            ? `${metrics.incomeProgress.toFixed(0)}% of ${formatCurrency(metrics.totalBudget)} budget`
            : `${formatCurrency(metrics.monthlyRevenue)} this month`,
          color: 'bg-primary',
        }}
      />
      <StatCard
        label="Monthly Expenses"
        value={formatCurrency(metrics.monthlyBurn)}
        icon="trending_down"
        iconColor="text-error"
        progress={{
          value: metrics.expenseProgress,
          label: metrics.totalBudget > 0
            ? `${metrics.expenseProgress.toFixed(0)}% of ${formatCurrency(metrics.totalBudget)} budget`
            : `${formatCurrency(metrics.monthlyBurn)} this month`,
          color: metrics.expenseProgress > 90 ? 'bg-error' : 'bg-secondary',
        }}
      />
    </section>
  );
}
