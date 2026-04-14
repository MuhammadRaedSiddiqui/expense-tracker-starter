import { FILTER_ALL, TRANSACTION_TYPES } from '../constants';

function TransactionFilters({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  categories,
}) {
  return (
    <div className="flex gap-2">
      <select
        value={filterType}
        onChange={e => setFilterType(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
      >
        <option value={FILTER_ALL}>All Types</option>
        <option value={TRANSACTION_TYPES.INCOME}>Income</option>
        <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
      </select>
      <select
        value={filterCategory}
        onChange={e => setFilterCategory(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
      >
        <option value={FILTER_ALL}>All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TransactionFilters;
