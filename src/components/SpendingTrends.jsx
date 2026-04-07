import { useMemo } from 'react';

function SpendingTrends({ transactions }) {
  // Group transactions by month
  const monthlyData = useMemo(() => {
    const grouped = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { income: 0, expense: 0, month: monthKey };
      }

      if (t.type === 'income') {
        grouped[monthKey].income += parseFloat(t.amount);
      } else {
        grouped[monthKey].expense += parseFloat(t.amount);
      }
    });

    // Convert to array and sort by month
    return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  // Calculate max value for scaling
  const maxValue = useMemo(() => {
    return Math.max(
      ...monthlyData.flatMap((d) => [d.income, d.expense]),
      100 // Minimum scale
    );
  }, [monthlyData]);

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(0)}`;
  };

  if (monthlyData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Spending Trends</h2>
        <p className="text-sm text-slate-500 text-center py-8">No data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Spending Trends</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-slate-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded"></div>
          <span className="text-sm text-slate-600">Expenses</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: '300px' }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency(maxValue * 0.75)}</span>
          <span>{formatCurrency(maxValue * 0.5)}</span>
          <span>{formatCurrency(maxValue * 0.25)}</span>
          <span>$0</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-8 border-l border-b border-gray-200">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ bottom: `${percent}%` }}
              ></div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around px-2">
            {monthlyData.map((data, index) => {
              const incomeHeight = (data.income / maxValue) * 100;
              const expenseHeight = (data.expense / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex items-end justify-center gap-1 px-1">
                  {/* Income bar */}
                  <div
                    className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative group"
                    style={{ height: `${incomeHeight}%`, maxWidth: '40px' }}
                    title={`Income: ${formatCurrency(data.income)}`}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {formatCurrency(data.income)}
                    </div>
                  </div>

                  {/* Expense bar */}
                  <div
                    className="w-full bg-rose-500 rounded-t hover:bg-rose-600 transition-colors cursor-pointer relative group"
                    style={{ height: `${expenseHeight}%`, maxWidth: '40px' }}
                    title={`Expenses: ${formatCurrency(data.expense)}`}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {formatCurrency(data.expense)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-around text-xs text-slate-500">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 text-center">
              {formatMonth(data.month)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpendingTrends;
