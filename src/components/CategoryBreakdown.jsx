import { useMemo } from 'react';

function CategoryBreakdown({ transactions }) {
  // Group expenses by category
  const categoryData = useMemo(() => {
    const grouped = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const category = t.category;
        if (!grouped[category]) {
          grouped[category] = 0;
        }
        grouped[category] += parseFloat(t.amount);
      });

    // Convert to array and sort by amount
    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.amount, 0);
  }, [categoryData]);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-cyan-500',
    ];
    return colors[index % colors.length];
  };

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Category</h2>
        <p className="text-sm text-slate-500 text-center py-8">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Category</h2>

      <div className="space-y-4">
        {categoryData.map((item, index) => {
          const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

          return (
            <div key={item.category}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${getColor(index)}`}></div>
                  <span className="text-sm font-medium text-slate-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-slate-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getColor(index)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-900">Total Expenses</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
    </div>
  );
}

export default CategoryBreakdown;
