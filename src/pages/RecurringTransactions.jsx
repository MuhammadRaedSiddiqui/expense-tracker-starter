import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOrganization } from '../hooks/useOrganization';
import {
  getRecurringTransactions,
  deleteRecurringTransaction,
  toggleRecurringTransaction,
} from '../lib/apiClient';
import { captureException } from '../lib/sentry';
import { CATEGORIES } from '../constants';
import RecurringTransactionModal from '../components/RecurringTransactionModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useRealtimeRecurring } from '../hooks/useRealtime';
import { useToast } from '../components/ToastContainer';
import { SkeletonTable } from '../components/Skeleton';

function RecurringTransactions() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Real-time recurring transactions with polling fallback
  const fetchRecurringTransactions = async () => {
    if (!organization) return [];
    const { data } = await getRecurringTransactions(organization.id, getToken);
    return data || [];
  };

  const { data: recurringTransactions, isRealtime, refetch } = useRealtimeRecurring(
    organization?.id,
    fetchRecurringTransactions,
    !!organization
  );

  const handleDelete = async (id) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const { error } = await deleteRecurringTransaction(transactionToDelete, getToken);
      if (error) throw error;

      // Immediately refetch to update UI
      if (refetch) {
        refetch();
      }

      toast.success('Recurring transaction deleted successfully');
    } catch (err) {
      console.error('Error deleting recurring transaction:', err);
      captureException(err, { context: 'deleteRecurringTransaction' });
      toast.error('Failed to delete recurring transaction');
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { error } = await toggleRecurringTransaction(id, getToken);
      if (error) throw error;

      // Immediately refetch to update UI
      if (refetch) {
        refetch();
      }

      toast.success('Recurring transaction updated successfully');
    } catch (err) {
      console.error('Error toggling recurring transaction:', err);
      captureException(err, { context: 'toggleRecurringTransaction' });
      toast.error('Failed to toggle recurring transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleModalSuccess = () => {
    // Immediately refetch to update UI
    if (refetch) {
      refetch();
    }
    handleModalClose();
  };

  const formatFrequency = (frequency, interval) => {
    if (interval === 1) {
      return frequency.charAt(0).toUpperCase() + frequency.slice(1);
    }
    return `Every ${interval} ${frequency}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-slate-900">Recurring Transactions</h1>
            {isRealtime && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Automatically create transactions on a schedule
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-slate-700 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
        >
          Add Recurring Transaction
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {!recurringTransactions ? (
        <SkeletonTable rows={5} />
      ) : recurringTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-4">No recurring transactions yet</p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Recurring Transaction
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {recurringTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`px-6 py-4 ${!transaction.is_active ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-slate-900">
                        {transaction.description}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                      {!transaction.is_active && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium text-slate-900">
                          {transaction.currency} {transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium text-slate-900">{transaction.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Frequency</p>
                        <p className="font-medium text-slate-900">
                          {formatFrequency(transaction.frequency, transaction.interval)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Execution</p>
                        <p className="font-medium text-slate-900">
                          {formatDate(transaction.next_execution_date)}
                        </p>
                      </div>
                    </div>

                    {transaction.end_date && (
                      <p className="text-xs text-gray-500 mt-2">
                        Ends on {formatDate(transaction.end_date)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggle(transaction.id)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        transaction.is_active
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {transaction.is_active ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="px-3 py-1 text-sm font-medium text-rose-600 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RecurringTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        organizationId={organization?.id}
        editingTransaction={editingTransaction}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Recurring Transaction"
        message="Are you sure you want to delete this recurring transaction? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
}

export default RecurringTransactions;
