import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import { FILTER_ALL } from '../constants'

function TransactionList({
  transactions,
  categories,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onDeleteTransaction,
  onEditTransaction
}) {
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

  // Filter by date range
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(t => t.date >= startDate);
  }
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(t => t.date <= endDate);
  }

  // Sort transactions
  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

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

      <div className="date-range-container">
        <div className="date-input-group">
          <label htmlFor="start-date">From:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
            aria-label="Start date"
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="end-date">To:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
            aria-label="End date"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="clear-dates"
            aria-label="Clear date range"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className="filters-sort-container">
        <TransactionFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
        />

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort by"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="description">Sort by Description</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            aria-label={`Sort order: ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

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
