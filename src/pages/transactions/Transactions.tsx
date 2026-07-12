import { useState, useEffect, useCallback } from 'react';
import { usePostHog } from '@posthog/react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastContainer';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/shared/PageHeader';
import CommandModal from '@/components/CommandModal';
import TransactionModal from './TransactionModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionStats from './TransactionStats';
import { useOrganization } from '@/integration/hooks/useOrganization';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { updateTransaction, deleteTransaction } from '@/integration/api/apiClient';
import { exportTransactionsToCSV } from '@/integration/utils/exportUtils';

export default function Transactions() {
  const posthog = usePostHog();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { organization, loading: orgLoading } = useOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (organization) {
      posthog?.capture('transactions_viewed', {
        organization_id: organization.id,
      });
    }
  }, [organization, posthog]);

  // Use React Query hook with realtime polling
  const { data: transactions, isLoading, refetch } = useTransactions(
    organization?.id,
    true // Enable realtime polling
  );

  // Filter state and logic extracted into hook
  const { filters, actions, filteredTransactions } = useTransactionFilters(transactions);

  const handleExportCSV = useCallback(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      toast.warning('No transactions to export');
      return;
    }

    posthog?.capture('transactions_exported', {
      organization_id: organization?.id,
      transaction_count: filteredTransactions.length,
    });

    const success = exportTransactionsToCSV(filteredTransactions);
    if (success) {
      toast.success('Transactions exported successfully');
    } else {
      toast.error('Failed to export transactions');
    }
  }, [filteredTransactions, toast, posthog, organization?.id]);

  const handleTransactionSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleEditTransaction = useCallback((transaction: any) => {
    setEditingTransaction(transaction);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingTransaction(null);
  }, []);

  const handleUpdateTransaction = useCallback(async (updatedData: any) => {
    if (!editingTransaction?.id) {
      toast.error('Transaction ID not found');
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await updateTransaction(
        editingTransaction.id,
        {
          description: updatedData.description,
          amount: parseFloat(updatedData.amount),
          type: updatedData.type,
          category: updatedData.category,
          date: updatedData.date,
          currency: updatedData.currency,
        },
        getToken
      );

      if (error) throw error;

      toast.success('Transaction updated successfully');
      setEditingTransaction(null);
      refetch(); // Refetch transactions to update the list

      posthog?.capture('transaction_updated', {
        organization_id: organization?.id,
        transaction_id: editingTransaction.id,
      });
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast.error('Failed to update transaction. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [editingTransaction, getToken, toast, refetch, posthog, organization?.id]);

  const handleDeleteTransaction = useCallback((transactionId: string) => {
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteTransaction = useCallback(async () => {
    if (!transactionToDelete) return;

    try {
      const { error } = await deleteTransaction(transactionToDelete, getToken);

      if (error) throw error;

      toast.success('Transaction deleted successfully');
      refetch(); // Refetch transactions to update the list

      posthog?.capture('transaction_deleted', {
        organization_id: organization?.id,
        transaction_id: transactionToDelete,
      });
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  }, [transactionToDelete, getToken, toast, refetch, posthog, organization?.id]);

  if (orgLoading || isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-surface-container rounded-lg"></div>
          <div className="h-64 bg-surface-container rounded-lg"></div>
        </div>
      </AppLayout>
    );
  }

  if (!organization) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-outline" data-icon="corporate_fare">
                  corporate_fare
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">No Organization Found</h2>
              <p className="text-sm text-on-surface-variant">
                Please create an organization to get started.
              </p>
            </div>
            <button
              onClick={() => navigate('/org-setup')}
              className="px-6 py-3 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-on-secondary-fixed-variant transition-all rounded-lg"
            >
              Create Organization
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader subtitle="LEDGER CONTROL" title="Transactions">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-outline-variant text-primary font-semibold text-sm rounded hover:bg-surface-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="file_download">
            file_download
          </span>
          Export CSV
        </button>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-secondary text-white font-semibold text-sm rounded hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="add">
            add
          </span>
          New transaction
        </button>
      </PageHeader>
      <p className="text-on-surface-variant mt-1 mb-8">
        Review and manage your organization's financial entries.
      </p>

      <TransactionFilters
        searchTerm={filters.searchTerm}
        onSearchChange={actions.setSearchTerm}
        filterType={filters.filterType}
        onTypeChange={actions.setFilterType}
        filterCategory={filters.filterCategory}
        onCategoryChange={actions.setFilterCategory}
        startDate={filters.startDate}
        onStartDateChange={actions.setStartDate}
        endDate={filters.endDate}
        onEndDateChange={actions.setEndDate}
      />

      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      <TransactionStats transactions={filteredTransactions} />

      {isModalOpen && (
        <CommandModal
          onClose={handleCloseModal}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateTransaction}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={confirmDeleteTransaction}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="danger"
      />
    </AppLayout>
  );
}
