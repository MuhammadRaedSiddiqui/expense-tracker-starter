import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import { FILTER_ALL } from '../constants'

function TransactionList({ transactions, categories, filterType, setFilterType, filterCategory, setFilterCategory, searchTerm, setSearchTerm, onDeleteTransaction, onEditTransaction }) {
  let filteredTransactions = transactions;

  // Filter by type
  if (filterType !== FILTER_ALL) {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }

  // Filter by category
  if (filterCategory !== FILTER_ALL) {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  // Filter by search term
  if (searchTerm.trim()) {
    filteredTransactions = filteredTransactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="transactions">
      <h2>Transactions</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search transactions by description"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="clear-search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <TransactionFilters
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
      <TransactionTable
        transactions={filteredTransactions}
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        categories={categories}
      />
    </div>
  );
}

export default TransactionList;
