import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import {
  getBudgets,
  getBudgetStatus,
  deleteBudget,
} from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import BudgetModal from '../components/BudgetModal';
import { useToast } from '../components/ToastContainer';
import { SkeletonBudgetCard } from '../components/Skeleton';

function Budgets() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const toast = useToast();
  const [budgets, setBudgets] = useState([]);
  const [budgetStatuses, setBudgetStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const loadData = async () => {
    if (!organization) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getBudgets(organization.id, getToken);

      if (apiError) throw apiError;

      setBudgets(data || []);

      // Load status for each budget
      const statuses = {};
      for (const budget of data || []) {
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
      captureException(err, { context: 'loadBudgets' });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      const { error } = await deleteBudget(id, getToken);
      if (error) throw error;
      loadData();
      toast.success('Budget deleted successfully');
    } catch (err) {
      console.error('Error deleting budget:', err);
      captureException(err, { context: 'deleteBudget' });
      toast.error('Failed to delete budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleModalSuccess = () => {
    loadData();
    handleModalClose();
  };

  const getStatusColor = (percentageUsed) => {
    if (percentageUsed >= 100) return 'rose';
    if (percentageUsed >= 80) return 'amber';
    return 'green';
  };

  const formatCurrency = (amount, currency) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">Budgets</h1>
          <p className="text-sm text-slate-500">
            Set spending limits and track your progress
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Create Budget
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBudgetCard key={i} />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-4">No budgets yet</p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const status = budgetStatuses[budget.id];
            const percentageUsed = status?.percentageUsed || 0;
            const color = getStatusColor(percentageUsed);

            return (
              <div
                key={budget.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{budget.category}</h3>
                    <p className="text-sm text-slate-500 capitalize">{budget.period}</p>
                  </div>
                  {!budget.is_active && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      {status ? formatCurrency(status.spent, budget.currency) : '...'} spent
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(parseFloat(budget.amount), budget.currency)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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

                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm font-medium ${
                      color === 'rose'
                        ? 'text-rose-600'
                        : color === 'amber'
                        ? 'text-amber-600'
                        : 'text-green-600'
                    }`}>
                      {percentageUsed.toFixed(1)}% used
                    </span>
                    {status && (
                      <span className="text-sm text-slate-600">
                        {status.remaining >= 0
                          ? `${formatCurrency(status.remaining, budget.currency)} left`
                          : `${formatCurrency(Math.abs(status.remaining), budget.currency)} over`}
                      </span>
                    )}
                  </div>
                </div>

                {status?.isOverBudget && (
                  <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    ⚠️ Budget exceeded
                  </div>
                )}

                {status && (
                  <p className="text-xs text-slate-500 mb-4">
                    Period: {new Date(status.periodStart).toLocaleDateString()} - {new Date(status.periodEnd).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        organizationId={organization?.id}
        editingBudget={editingBudget}
      />
    </div>
  );
}

export default Budgets;
