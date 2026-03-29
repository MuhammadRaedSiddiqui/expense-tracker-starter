import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'

function TransactionList({ transactions, categories, filterType, setFilterType, filterCategory, setFilterCategory, onDeleteTransaction, onEditTransaction }) {
  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  return (
    <div className="transactions">
      <h2>Transactions</h2>
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
