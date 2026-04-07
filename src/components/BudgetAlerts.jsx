import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getBudgets, getBudgetStatus } from '../lib/apiClient';
import { captureException } from '../lib/sentry';

function BudgetAlerts({ organizationId }) {
  const { getToken } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBudgetAlerts() {
      if (!organizationId) return;

      try {
        const { data, error } = await getBudgets(organizationId, getToken);
        if (error) throw error;

        const activeBudgets = (data || []).filter(b => b.is_active);
        const budgetAlerts = [];

        for (const budget of activeBudgets) {
          try {
            const { data: statusData } = await getBudgetStatus(budget.id, getToken);
            if (statusData?.status) {
              const { percentageUsed, isOverBudget } = statusData.status;

              // Alert if over budget or approaching limit (80%+)
              if (isOverBudget) {
                budgetAlerts.push({
                  budget,
                  status: statusData.status,
                  severity: 'critical',
                  message: `${budget.category} budget exceeded`,
                });
              } else if (percentageUsed >= 80) {
                budgetAlerts.push({
                  budget,
                  status: statusData.status,
                  severity: 'warning',
                  message: `${budget.category} budget at ${percentageUsed.toFixed(0)}%`,
                });
              }
            }
          } catch (err) {
            console.error(`Error loading status for budget ${budget.id}:`, err);
          }
        }

        // Sort by severity (critical first)
        budgetAlerts.sort((a, b) => {
          if (a.severity === 'critical' && b.severity !== 'critical') return -1;
          if (a.severity !== 'critical' && b.severity === 'critical') return 1;
          return 0;
        });

        setAlerts(budgetAlerts);
      } catch (err) {
        console.error('Error loading budget alerts:', err);
        captureException(err, { context: 'loadBudgetAlerts' });
      } finally {
        setLoading(false);
      }
    }

    loadBudgetAlerts();
  }, [organizationId, getToken]);

  if (loading || alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-lg border px-4 py-3 ${
            alert.severity === 'critical'
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-lg">
                {alert.severity === 'critical' ? '🚨' : '⚠️'}
              </span>
              <div>
                <p
                  className={`text-sm font-medium ${
                    alert.severity === 'critical' ? 'text-rose-900' : 'text-amber-900'
                  }`}
                >
                  {alert.message}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    alert.severity === 'critical' ? 'text-rose-700' : 'text-amber-700'
                  }`}
                >
                  {alert.budget.currency} {alert.status.spent.toFixed(2)} spent of{' '}
                  {alert.budget.currency} {parseFloat(alert.budget.amount).toFixed(2)}
                  {alert.severity === 'critical' &&
                    ` (${alert.budget.currency} ${Math.abs(alert.status.remaining).toFixed(2)} over)`}
                </p>
              </div>
            </div>
            <Link
              to="/budgets"
              className={`text-xs font-medium hover:underline ${
                alert.severity === 'critical' ? 'text-rose-700' : 'text-amber-700'
              }`}
            >
              View Budget
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetAlerts;
