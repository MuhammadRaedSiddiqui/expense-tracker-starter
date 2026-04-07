import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getBudgets, getBudgetStatus } from '../lib/apiClient';
import { captureException } from '../lib/sentry';

function BudgetOverview({ organizationId }) {
  const { getToken } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [budgetStatuses, setBudgetStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBudgets() {
      if (!organizationId) return;

      try {
        const { data, error } = await getBudgets(organizationId, getToken);
        if (error) throw error;

        const activeBudgets = (data || []).filter(b => b.is_active).slice(0, 3);
        setBudgets(activeBudgets);

        // Load status for each budget
        const statuses = {};
        for (const budget of activeBudgets) {
          try {
            const { data: statusData } = await getBudgetStatus(budget.id, getToken);
            if (statusData) {
              statuses[budget.id] = statusData.status;
            }
          } catch (err) {
            console.error(`Error loading status for budget ${budget.id}:`, err);
          }
        }
        setBudgetStatuses(statuses);
      } catch (err) {
        console.error('Error loading budgets:', err);
        captureException(err, { context: 'loadBudgetsOverview' });
      } finally {
        setLoading(false);
      }
    }

    loadBudgets();
  }, [organizationId, getToken]);

  const getStatusColor = (percentageUsed) => {
    if (percentageUsed >= 100) return 'rose';
    if (percentageUsed >= 80) return 'amber';
    return 'green';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget Overview</h2>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget Overview</h2>
        <p className="text-sm text-slate-500 mb-4">No active budgets yet</p>
        <Link
          to="/budgets"
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Budget
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Budget Overview</h2>
        <Link
          to="/budgets"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const status = budgetStatuses[budget.id];
          const percentageUsed = status?.percentageUsed || 0;
          const color = getStatusColor(percentageUsed);

          return (
            <div key={budget.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{budget.category}</h3>
                  <p className="text-xs text-slate-500 capitalize">{budget.period}</p>
                </div>
                {status?.isOverBudget && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-rose-100 text-rose-700">
                    Over Budget
                  </span>
                )}
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      color === 'rose'
                        ? 'bg-rose-500'
                        : color === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  color === 'rose'
                    ? 'text-rose-600'
                    : color === 'amber'
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}>
                  {percentageUsed.toFixed(0)}% used
                </span>
                <span className="text-slate-600">
                  {status ? `${budget.currency} ${status.spent.toFixed(0)}` : '...'} / {budget.currency} {parseFloat(budget.amount).toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetOverview;
