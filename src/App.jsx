import { useState, useEffect } from 'react'
import './App.css'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import { CATEGORIES, INITIAL_TRANSACTIONS, STORAGE_KEY, FILTER_ALL } from './constants'

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterCategory, setFilterCategory] = useState(FILTER_ALL);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

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
        </div>
        <button onClick={handleClearAll} className="clear-btn" aria-label="Clear all transactions">
          Clear All Data
        </button>
      </div>

      <Summary transactions={transactions} />

      <TransactionForm onAddTransaction={handleAddTransaction} categories={CATEGORIES} />

      <TransactionList
        transactions={transactions}
        categories={CATEGORIES}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onDeleteTransaction={handleDeleteTransaction}
        onEditTransaction={handleEditTransaction}
      />
    </div>
  );
}

export default App
