import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import SpendingByCategory from './components/SpendingByCategory';
import IncomeVsExpenses from './components/IncomeVsExpenses';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import { useToast } from './components/ToastContainer';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from './lib/supabaseQueries';
import { getClerkUserId } from './lib/clerk';
import { captureException } from './lib/sentry';
import {
  CATEGORIES,
  FILTER_ALL,
  EXCHANGE_RATES as STATIC_RATES,
} from './constants';

function App({ organization, initialTransactions, onDataChange }) {
  const { user } = useUser();
  const toast = useToast();
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

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

  // Update local state when initialTransactions change
  useEffect(() => {
    setTransactions(initialTransactions || []);
  }, [initialTransactions]);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  // Check for stale exchange rates periodically
  useEffect(() => {
    const RATE_EXPIRY_MS = 3600000; // 1 hour
    const CHECK_INTERVAL_MS = 60000; // Check every minute

    const checkRateExpiry = () => {
      if (ratesLastUpdated) {
        const age = Date.now() - ratesLastUpdated.getTime();
        if (age > RATE_EXPIRY_MS && !ratesLoading) {
          console.log('Exchange rates expired, refreshing...');
          fetchExchangeRates();
        }
      }
    };

    const intervalId = setInterval(checkRateExpiry, CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [ratesLastUpdated, ratesLoading]);

  const fetchExchangeRates = async () => {
    setRatesLoading(true);
    setRatesError(null);

    try {
      // Using frankfurter.app API - free, no API key needed
      const response = await fetch('https://api.frankfurter.app/latest?from=USD');

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();

      // Convert API response to our format (1 USD = X currency)
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
      // Keep using static rates as fallback
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    setError(null);
    setLoading(true);

    try {
      const userId = getClerkUserId(user);
      const { data, error: createError } = await createTransaction(
        organization.id,
        userId,
        newTransaction
      );

      if (createError) {
        // Check for duplicate idempotency key (constraint violation)
        if (createError.code === '23505' && createError.message?.includes('idempotency_key')) {
          // Duplicate submission detected - silently ignore
          toast.info('Transaction already added');
          setIsModalOpen(false);
          setLoading(false);
          return;
        }
        throw createError;
      }

      // Store previous state for potential rollback
      const previousTransactions = transactions;

      try {
        // Update local state optimistically
        setTransactions([data, ...transactions]);

        // Notify parent to refetch (ensures sync)
        if (onDataChange) {
          await onDataChange();
        }

        toast.success('Transaction added successfully');
        setIsModalOpen(false);
      } catch (refetchError) {
        // Rollback on refetch failure
        setTransactions(previousTransactions);
        throw refetchError;
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      captureException(err, { context: 'handleAddTransaction' });
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setError(null);
    setLoading(true);

    try {
      const { error: deleteError } = await deleteTransaction(id);

      if (deleteError) throw deleteError;

      // Store previous state for potential rollback
      const previousTransactions = transactions;

      try {
        // Update local state
        setTransactions(transactions.filter(t => t.id !== id));

        // Notify parent
        if (onDataChange) {
          await onDataChange();
        }

        toast.success('Transaction deleted successfully');
      } catch (refetchError) {
        // Rollback on refetch failure
        setTransactions(previousTransactions);
        throw refetchError;
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      captureException(err, { context: 'handleDeleteTransaction' });
      toast.error('Failed to delete transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: updateError } = await updateTransaction(
        updatedTransaction.id,
        updatedTransaction
      );

      if (updateError) throw updateError;

      // Store previous state for potential rollback
      const previousTransactions = transactions;

      try {
        // Update local state
        setTransactions(
          transactions.map(t => (t.id === data.id ? data : t))
        );

        // Notify parent
        if (onDataChange) {
          await onDataChange();
        }

        toast.success('Transaction updated successfully');
      } catch (refetchError) {
        // Rollback on refetch failure
        setTransactions(previousTransactions);
        throw refetchError;
      }
    } catch (err) {
      console.error('Error updating transaction:', err);
      captureException(err, { context: 'handleEditTransaction' });
      toast.error('Failed to update transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setClearAllDialogOpen(true);
  };

  const confirmClearAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteAllTransactions(organization.id);

      if (deleteError) throw deleteError;

      // Clear local state
      setTransactions([]);

      // Notify parent
      if (onDataChange) {
        onDataChange();
      }

      toast.success('All transactions deleted successfully');
    } catch (err) {
      console.error('Error clearing transactions:', err);
      captureException(err, { context: 'handleClearAll' });
      toast.error('Failed to clear transactions. Please try again.');
    } finally {
      setLoading(false);
      setClearAllDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-1">Finance Tracker</h1>
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

        <Summary transactions={transactions} exchangeRates={exchangeRates} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <SpendingByCategory transactions={transactions} exchangeRates={exchangeRates} />
          <IncomeVsExpenses transactions={transactions} exchangeRates={exchangeRates} />
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            categories={[...CATEGORIES.income, ...CATEGORIES.expense]}
            onClose={() => setIsModalOpen(false)}
            loading={loading}
          />
        </Modal>

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
    </div>
  );
}

export default App;
