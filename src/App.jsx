import { useState, useEffect } from 'react';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import SpendingByCategory from './components/SpendingByCategory';
import IncomeVsExpenses from './components/IncomeVsExpenses';
import Modal from './components/Modal';
import {
  CATEGORIES,
  INITIAL_TRANSACTIONS,
  STORAGE_KEY,
  FILTER_ALL,
  EXCHANGE_RATES as STATIC_RATES,
} from './constants';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [exchangeRates, setExchangeRates] = useState(STATIC_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

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

  const handleAddTransaction = newTransaction => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = id => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = updatedTransaction => {
    setTransactions(
      transactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const handleClearAll = () => {
    if (
      window.confirm('Are you sure you want to delete all transactions? This cannot be undone.')
    ) {
      setTransactions(INITIAL_TRANSACTIONS);
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

        <Summary transactions={transactions} exchangeRates={exchangeRates} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <SpendingByCategory transactions={transactions} exchangeRates={exchangeRates} />
          <IncomeVsExpenses transactions={transactions} exchangeRates={exchangeRates} />
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            categories={CATEGORIES}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
