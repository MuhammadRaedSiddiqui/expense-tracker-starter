import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import { FILTER_ALL } from '../constants'

function TransactionList({ transactions, categories, filterType, setFilterType, filterCategory, setFilterCategory, onDeleteTransaction, onEditTransaction }) {
  let filteredTransactions = transactions;
  if (filterType !== FILTER_ALL) {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== FILTER_ALL) {
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
