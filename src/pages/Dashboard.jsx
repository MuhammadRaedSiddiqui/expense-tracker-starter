import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SpendingByCategory from '../components/SpendingByCategory';
import IncomeVsExpenses from '../components/IncomeVsExpenses';
import BudgetOverview from '../components/BudgetOverview';
import BudgetAlerts from '../components/BudgetAlerts';
import Modal from '../components/Modal';
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
  const { organization, refetch } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real-time transactions with polling fallback
  const fetchTransactions = async () => {
    if (!organization) return [];
    const { data } = await getTransactions(organization.id, getToken);
    return data || [];
  };

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
    } catch (err) {
      console.error('Error adding transaction:', err);
      captureException(err, { context: 'handleAddTransaction' });
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteTransaction(id, getToken);

      if (deleteError) throw deleteError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      captureException(err, { context: 'handleDeleteTransaction' });
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setLoading(false);
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
    } catch (err) {
      console.error('Error updating transaction:', err);
      captureException(err, { context: 'handleEditTransaction' });
      setError('Failed to update transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm('Are you sure you want to delete all transactions? This cannot be undone.')
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteAllTransactions(organization.id, getToken);

      if (deleteError) throw deleteError;

      // Immediately refetch transactions to update UI
      if (refetchTransactions) {
        refetchTransactions();
      }
    } catch (err) {
      console.error('Error clearing transactions:', err);
      captureException(err, { context: 'handleClearAll' });
      setError('Failed to clear transactions. Please try again.');
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
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Add Transaction
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
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
            <SpendingByCategory transactions={transactions} exchangeRates={exchangeRates} />
            <IncomeVsExpenses transactions={transactions} exchangeRates={exchangeRates} />
            <BudgetOverview organizationId={organization?.id} />
          </div>

          <TransactionList
            transactions={transactions}
            categories={CATEGORIES}
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
          categories={CATEGORIES}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
