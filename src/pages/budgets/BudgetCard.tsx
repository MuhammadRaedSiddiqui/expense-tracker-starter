import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/components/ToastContainer';
import { deleteBudget } from '@/integration/api/apiClient';
import DeleteBudgetModal from '@/components/DeleteBudgetModal';
import type { Budget } from '@/types';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onDelete?: () => void;
  onEdit?: (budget: Budget) => void;
}

export default function BudgetCard({ budget, spent, onDelete, onEdit }: BudgetCardProps) {
  const { getToken } = useAuth();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const utilization = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;

  const getStatus = () => {
    if (utilization >= 100) return 'over';
    if (utilization >= 80) return 'approaching';
    return 'on-track';
  };

  const status = getStatus();

  const statusConfig = {
    'on-track': {
      color: 'text-secondary',
      bg: 'bg-secondary-container',
      barColor: 'bg-secondary',
      label: 'On Track',
    },
    approaching: {
      color: 'text-tertiary',
      bg: 'bg-tertiary-container',
      barColor: 'bg-tertiary',
      label: 'Approaching Limit',
    },
    over: {
      color: 'text-error',
      bg: 'bg-error-container',
      barColor: 'bg-error',
      label: 'Over Budget',
    },
  };

  const config = statusConfig[status];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async (budgetId: string) => {
    setDeleting(true);
    try {
      const { error } = await deleteBudget(budgetId, getToken);
      if (error) throw error;
      toast.success('Budget deleted successfully');
      onDelete?.();
    } catch (err) {
      console.error('Error deleting budget:', err);
      toast.error('Failed to delete budget');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-outline uppercase mb-1">
              {budget.period}
            </p>
            <h3 className="text-xl font-bold text-on-surface capitalize">{budget.category}</h3>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 ${config.bg} ${config.color} text-[10px] font-bold rounded uppercase`}
            >
              {config.label}
            </span>
            <button
              onClick={() => onEdit?.(budget)}
              className="text-outline-variant hover:text-secondary transition-colors"
              title="Edit budget"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-outline-variant hover:text-error transition-colors disabled:opacity-50"
              title="Delete budget"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-on-surface-variant">Spent</span>
            <span className={`text-2xl font-bold font-mono ${config.color}`}>
              {formatCurrency(spent)}
            </span>
          </div>

          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.barColor} transition-all duration-500`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-on-surface-variant">
              {utilization.toFixed(1)}% utilized
            </span>
            <span className="font-mono text-on-surface">
              {remaining >= 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))}{' '}
              {remaining >= 0 ? 'remaining' : 'over'}
            </span>
          </div>

          <div className="pt-4 border-t border-outline-variant/10 flex justify-between text-xs">
            <span className="text-on-surface-variant">Budget</span>
            <span className="font-mono font-bold text-on-surface">
              {formatCurrency(budget.amount)}
            </span>
          </div>
        </div>
      </div>

      <DeleteBudgetModal
        budget={budget}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
