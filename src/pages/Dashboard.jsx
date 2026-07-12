import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useToast } from '../components/ToastContainer';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SpendingByCategory from '../components/SpendingByCategory';
import IncomeVsExpenses from '../components/IncomeVsExpenses';
import BudgetOverview from '../components/BudgetOverview';
import BudgetAlerts from '../components/BudgetAlerts';
import ErrorBoundary from '../components/ErrorBoundary';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonCard, SkeletonTable, SkeletonChart } from '../components/Skeleton';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from '../lib/apiClient';
import { getClerkUserId } from '../lib/clerk';
import { captureException } from '../lib/sentry';
import {
  CATEGORIES,
  FILTER_ALL,
  EXCHANGE_RATES as STATIC_RATES,
} from '../constants';
import { useOrganization } from '../hooks/useOrganization';
import { useRealtimeTransactions } from '../hooks/useRealtime';

function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const toast = useToast();
  const { organization, refetch } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real-time transactions with polling fallback
  const fetchTransactions = useCallback(async () => {
    if (!organization) return [];
    const { data } = await getTransactions(organization.id, getToken);
    return data || [];
  }, [organization, getToken]);

  const { data: transactions, isRealtime, refetch: refetchTransactions } = useRealtimeTransactions(
    organization?.id,
    fetchTransactions,
    !!organization
  );

  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [exchangeRates, setExchangeRates] = useState(STATIC_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setRatesLoading(true);
    setRatesError(null);

    try {
      const response = await fetch('https://api.frankfurter.app/latest?from=USD');

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();

      const rates = {
        USD: 1,
        ...data.rates,
      };

      setExchangeRates(rates);
      setRatesLastUpdated(new Date());
      setRatesLoading(false);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setRatesError('Failed to fetch live rates. Using cached rates.');
      setRatesLoading(false);
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    setLoading(true);
    setError(null);

    try {
      const userId = getClerkUserId(user);
      const { error: createError } = await createTransaction(
        organization.id,
        userId,
        newTransaction,
        getToken
      );

      if (createError) throw createError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }

      // Show success toast
      toast.success('Transaction added successfully');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      captureException(err, { context: 'handleAddTransaction' });
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    // Open confirmation dialog
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteTransaction(transactionToDelete, getToken);

      if (deleteError) throw deleteError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }

      // Show success toast
      toast.success('Transaction deleted successfully');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      captureException(err, { context: 'handleDeleteTransaction' });
      toast.error('Failed to delete transaction. Please try again.');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await updateTransaction(
        updatedTransaction.id,
        updatedTransaction,
        getToken
      );

      if (updateError) throw updateError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }

      // Show success toast
      toast.success('Transaction updated successfully');
    } catch (err) {
      console.error('Error updating transaction:', err);
      captureException(err, { context: 'handleEditTransaction' });
      toast.error('Failed to update transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    // Open confirmation dialog
    setClearAllDialogOpen(true);
  };

  const confirmClearAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteAllTransactions(organization.id, getToken);

      if (deleteError) throw deleteError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }

      // Show success toast
      toast.success('All transactions deleted successfully');
    } catch (err) {
      console.error('Error clearing transactions:', err);
      captureException(err, { context: 'handleClearAll' });
      toast.error('Failed to clear transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            {isRealtime && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Track your income and expenses</p>
          {ratesLastUpdated && (
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              Exchange rates updated: {ratesLastUpdated.toLocaleTimeString()}
              <button
                onClick={fetchExchangeRates}
                disabled={ratesLoading}
                className="text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {ratesLoading ? '⟳' : '↻'}
              </button>
            </p>
          )}
          {ratesError && <p className="text-xs text-rose-600 mt-1">{ratesError}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-slate-700 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
          >
            Add Transaction
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Clear all transactions"
          >
            Clear All
          </button>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-4 py-3"
          role="alert"
        >
          {error}
        </div>
      )}

      <BudgetAlerts organizationId={organization?.id} />

      {!transactions ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <SkeletonChart />
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable rows={5} />
        </>
      ) : (
        <>
          <Summary transactions={transactions} exchangeRates={exchangeRates} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ErrorBoundary>
              <SpendingByCategory transactions={transactions} exchangeRates={exchangeRates} />
            </ErrorBoundary>
            <ErrorBoundary>
              <IncomeVsExpenses transactions={transactions} exchangeRates={exchangeRates} />
            </ErrorBoundary>
            <ErrorBoundary>
              <BudgetOverview organizationId={organization?.id} />
            </ErrorBoundary>
          </div>

          <TransactionList
            transactions={transactions}
            categories={[...CATEGORIES.income, ...CATEGORIES.expense]}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm
          onAddTransaction={handleAddTransaction}
          categories={[...CATEGORIES.income, ...CATEGORIES.expense]}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

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

      <ConfirmDialog
        isOpen={clearAllDialogOpen}
        onClose={() => setClearAllDialogOpen(false)}
        onConfirm={confirmClearAll}
        title="Clear All Transactions"
        message="Are you sure you want to delete all transactions? This action cannot be undone."
        confirmText="Clear All"
        confirmStyle="danger"
      />
    </div>
  );
}

export default Dashboard;
