import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from '../lib/supabaseQueries';
import { getClerkUserId } from '../lib/clerk';
import { captureException } from '../lib/sentry';
import { CATEGORIES, FILTER_ALL } from '../constants';
import { useOrganization } from '../hooks/useOrganization';

function Transactions() {
  const { user } = useUser();
  const { organization, transactions: initialTransactions, refetch } = useOrganization();
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTransactions(initialTransactions || []);
  }, [initialTransactions]);

  const handleAddTransaction = async (newTransaction) => {
    setLoading(true);
    setError(null);

    try {
      const userId = getClerkUserId(user);
      const { data, error: createError } = await createTransaction(
        organization.id,
        userId,
        newTransaction
      );

      if (createError) throw createError;

      setTransactions([data, ...transactions]);

      if (refetch) {
        refetch();
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
      const { error: deleteError } = await deleteTransaction(id);

      if (deleteError) throw deleteError;

      setTransactions(transactions.filter(t => t.id !== id));

      if (refetch) {
        refetch();
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
      const { data, error: updateError } = await updateTransaction(
        updatedTransaction.id,
        updatedTransaction
      );

      if (updateError) throw updateError;

      setTransactions(
        transactions.map(t => (t.id === data.id ? data : t))
      );

      if (refetch) {
        refetch();
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
      const { error: deleteError } = await deleteAllTransactions(organization.id);

      if (deleteError) throw deleteError;

      setTransactions([]);

      if (refetch) {
        refetch();
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
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">Transactions</h1>
          <p className="text-sm text-slate-500">
            Manage all your income and expense transactions
          </p>
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

export default Transactions;
