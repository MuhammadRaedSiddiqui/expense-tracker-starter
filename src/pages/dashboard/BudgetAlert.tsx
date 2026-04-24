import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import type { Budget } from '@/types';

interface BudgetAlertProps {
  organizationId?: string;
}

export default function BudgetAlert({ organizationId }: BudgetAlertProps) {
  const { data: transactions } = useTransactions(organizationId);
  const { data: budgets } = useBudgets(organizationId);

  const [overBudget, setOverBudget] = useState<{
    budget: Budget;
    spent: number;
    percentage: number;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!budgets || !transactions) return;

    // Check each budget
    for (const budget of budgets) {
      const categorySpending = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            new Date(t.date) >= new Date(budget.start_date) &&
            (!budget.end_date || new Date(t.date) <= new Date(budget.end_date))
        )
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const percentage = (categorySpending / budget.amount) * 100;

      if (percentage > 100) {
        setOverBudget({
          budget,
          spent: categorySpending,
          percentage,
        });
        break; // Show only the first over-budget alert
      }
    }
  }, [budgets, transactions]);

  if (!overBudget || dismissed) return null;

  const overage = overBudget.percentage - 100;

  return (
    <section className="bg-error-container/10 border border-error/20 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-error/10 flex items-center justify-center text-error">
          <span className="material-symbols-outlined" data-icon="warning">
            warning
          </span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-error-container">
            Critical Budget Alert: "{overBudget.budget.category}"
          </h4>
          <p className="text-xs text-on-error-container/80">
            You have exceeded your {overBudget.budget.period} allocation by{' '}
            <span className="font-bold">{overage.toFixed(1)}%</span>. Immediate review suggested.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-on-error-container/50 hover:text-on-error-container transition-colors"
      >
        <span className="material-symbols-outlined" data-icon="close">
          close
        </span>
      </button>
    </section>
  );
}
