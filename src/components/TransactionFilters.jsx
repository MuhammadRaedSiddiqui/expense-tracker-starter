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
      <div className="relative">
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg text-body-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value={FILTER_ALL}>All Types</option>
          <option value={TRANSACTION_TYPES.INCOME}>Income</option>
          <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="relative">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg text-body-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value={FILTER_ALL}>All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default TransactionFilters;
