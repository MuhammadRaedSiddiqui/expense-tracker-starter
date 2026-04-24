import { CATEGORIES } from '@/constants';

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
}

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onTypeChange,
  filterCategory,
  onCategoryChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: TransactionFiltersProps) {
  const allCategories = [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])];

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20 mb-6 flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm"
          data-icon="search"
        >
          search
        </span>
        <input
          className="w-full border-outline-variant/20 bg-surface-container-low rounded text-sm pl-10 py-2 focus:ring-2 focus:ring-secondary/20"
          placeholder="Search description..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="text-sm border-outline-variant/20 bg-surface-container-low rounded pr-10 py-2 focus:ring-2 focus:ring-secondary/20"
        value={filterType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select
        className="text-sm border-outline-variant/20 bg-surface-container-low rounded pr-10 py-2 focus:ring-2 focus:ring-secondary/20"
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none"
            data-icon="calendar_today"
          >
            calendar_today
          </span>
          <input
            className="text-sm border-outline-variant/20 bg-surface-container-low rounded pl-10 py-2 w-40 font-mono focus:ring-2 focus:ring-secondary/20"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            placeholder="Start date"
          />
        </div>
        <div className="relative">
          <input
            className="text-sm border-outline-variant/20 bg-surface-container-low rounded px-3 py-2 w-40 font-mono focus:ring-2 focus:ring-secondary/20"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            placeholder="End date"
          />
        </div>
      </div>
    </div>
  );
}
