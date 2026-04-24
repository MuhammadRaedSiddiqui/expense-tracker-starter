import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/components/ToastContainer';
import { toggleRecurringTransaction, deleteRecurringTransaction } from '@/integration/api/apiClient';
import DeleteRecurringTransactionModal from '@/components/DeleteRecurringTransactionModal';
import type { RecurringTransaction } from '@/types';

interface RecurringCardProps {
  recurring: RecurringTransaction;
  onUpdate?: () => void;
  onEdit?: (recurring: RecurringTransaction) => void;
}

export default function RecurringCard({ recurring, onUpdate, onEdit }: RecurringCardProps) {
  const { getToken } = useAuth();
  const toast = useToast();
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getIcon = (category: string) => {
    const icons: Record<string, string> = {
      utilities: 'cloud_queue',
      housing: 'apartment',
      entertainment: 'mail',
      salary: 'payments',
      freelance: 'work',
    };
    return icons[category] || 'sync';
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { error } = await toggleRecurringTransaction(recurring.id, getToken);
      if (error) throw error;
      toast.success(`Recurring transaction ${!recurring.is_active ? 'activated' : 'paused'}`);
      onUpdate?.();
    } catch (err) {
      console.error('Error toggling recurring transaction:', err);
      toast.error('Failed to toggle recurring transaction');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async (recurringId: string) => {
    setDeleting(true);
    try {
      const { error } = await deleteRecurringTransaction(recurringId, getToken);
      if (error) throw error;
      toast.success('Recurring transaction deleted successfully');
      onUpdate?.();
    } catch (err) {
      console.error('Error deleting recurring transaction:', err);
      toast.error('Failed to delete recurring transaction');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/20 shadow-sm transition-all ${
          !recurring.is_active ? 'opacity-60' : ''
        }`}
      >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            recurring.is_active ? 'bg-primary-container' : 'bg-surface-container'
          }`}
        >
          <span
            className={`material-symbols-outlined ${
              recurring.is_active ? 'text-primary' : 'text-on-surface-variant'
            }`}
            data-icon={getIcon(recurring.category)}
          >
            {getIcon(recurring.category)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              recurring.is_active
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant'
            } disabled:opacity-50`}
          >
            {recurring.is_active ? 'ACTIVE' : 'INACTIVE'}
          </button>
          <button
            onClick={() => onEdit?.(recurring)}
            className="text-outline-variant hover:text-secondary transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-outline-variant hover:text-error transition-colors disabled:opacity-50"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-on-surface mb-1">{recurring.description}</h3>
      <p className="text-xs text-on-surface-variant mb-4 capitalize">
        {recurring.type} • {recurring.frequency}
      </p>

      <div className="space-y-2 pt-4 border-t border-outline-variant/10">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Next execution</span>
          <span className="font-mono text-on-surface">
            {formatDate(recurring.next_execution_date)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Amount</span>
          <span className="font-mono font-bold text-on-surface">
            {formatCurrency(parseFloat(recurring.amount.toString()))}
          </span>
        </div>
      </div>
      </div>

      <DeleteRecurringTransactionModal
        recurringTransaction={recurring}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
