import { useMemo } from 'react';
import type { Budget } from '@/types';

interface BudgetHealthBannerProps {
  budgets: Array<{ budget: Budget; spent: number; utilization: number }>;
}

export default function BudgetHealthBanner({ budgets }: BudgetHealthBannerProps) {
  const stats = useMemo(() => {
    const total = budgets.length;
    const overBudget = budgets.filter((b) => b.utilization >= 100).length;
    const onTrack = budgets.filter((b) => b.utilization < 80).length;
    const approaching = budgets.filter((b) => b.utilization >= 80 && b.utilization < 100).length;

    const totalOverage = budgets
      .filter((b) => b.spent > b.budget.amount)
      .reduce((sum, b) => sum + (b.spent - b.budget.amount), 0);

    const totalBudget = budgets.reduce((sum, b) => sum + b.budget.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const overallUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      total,
      overBudget,
      onTrack,
      approaching,
      totalOverage,
      overallUtilization,
    };
  }, [budgets]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getHealthColor = () => {
    if (stats.overallUtilization >= 100) return 'bg-error';
    if (stats.overallUtilization >= 80) return 'bg-tertiary';
    return 'bg-secondary';
  };

  const getHealthMessage = () => {
    if (stats.totalOverage > 0) {
      return `${formatCurrency(stats.totalOverage)} over total allocation`;
    }
    return 'All budgets within limits';
  };

  return (
    <div className="bg-surface rounded-lg p-4 border border-outline-variant/10 shadow-sm flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 w-full">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          Total Budget Health
        </p>
        <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full ${getHealthColor()} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(stats.overallUtilization, 100)}%` }}
          ></div>
        </div>
        <p
          className={`text-[12px] font-medium flex items-center gap-1 ${
            stats.totalOverage > 0 ? 'text-error' : 'text-secondary'
          }`}
        >
          <span
            className="material-symbols-outlined text-xs"
            data-icon={stats.totalOverage > 0 ? 'error' : 'check_circle'}
          >
            {stats.totalOverage > 0 ? 'error' : 'check_circle'}
          </span>
          {getHealthMessage()}
        </p>
      </div>
      <div className="flex items-center gap-6 self-stretch">
        {[
          { label: 'Budgets Tracked', value: stats.total.toString(), color: 'text-on-surface' },
          { label: 'Over Budget', value: stats.overBudget.toString(), color: 'text-error' },
          { label: 'On Track', value: stats.onTrack.toString(), color: 'text-secondary' },
          {
            label: 'Approaching Limit',
            value: stats.approaching.toString(),
            color: 'text-tertiary',
          },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-6">
            {i > 0 && <div className="h-10 w-px bg-outline-variant/20"></div>}
            <div className="px-6 flex flex-col items-center">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`text-[18px] font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
