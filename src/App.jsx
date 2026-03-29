import { useState, useEffect } from 'react'
import './App.css'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import { CATEGORIES, INITIAL_TRANSACTIONS, STORAGE_KEY, FILTER_ALL, EXCHANGE_RATES as STATIC_RATES } from './constants'

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [exchangeRates, setExchangeRates] = useState(STATIC_RATES);
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(null);

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
        ...data.rates
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

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>Finance Tracker</h1>
          <p className="subtitle">Track your income and expenses</p>
          {ratesLastUpdated && (
            <p className="rates-info">
              Exchange rates updated: {ratesLastUpdated.toLocaleTimeString()}
              <button onClick={fetchExchangeRates} className="refresh-rates" disabled={ratesLoading}>
                {ratesLoading ? '⟳' : '↻'}
              </button>
            </p>
          )}
          {ratesError && <p className="rates-error">{ratesError}</p>}
        </div>
        <div className="header-actions">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleClearAll} className="clear-btn" aria-label="Clear all transactions">
            Clear All Data
          </button>
        </div>
      </div>

      <Summary transactions={transactions} exchangeRates={exchangeRates} />

      <TransactionForm onAddTransaction={handleAddTransaction} categories={CATEGORIES} />

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
    </div>
  );
}

export default App
