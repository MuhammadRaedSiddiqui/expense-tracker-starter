import { useMemo } from 'react';

function PeriodComparison({ transactions, startDate, endDate }) {
  const comparison = useMemo(() => {
    // Parse dates with explicit time to avoid timezone issues
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');

    // Calculate period length in days
    const periodLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate previous period dates
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - periodLength);

    // Filter transactions for current period
    const currentPeriod = transactions.filter((t) => {
      // Handle both YYYY-MM-DD and ISO formats
      const dateStr = typeof t.date === 'string' ? t.date.split('T')[0] : t.date;
      const date = new Date(dateStr + 'T00:00:00');
      return date >= start && date <= end;
    });

    // Filter transactions for previous period
    const previousPeriod = transactions.filter((t) => {
      // Handle both YYYY-MM-DD and ISO formats
      const dateStr = typeof t.date === 'string' ? t.date.split('T')[0] : t.date;
      const date = new Date(dateStr + 'T00:00:00');
      return date >= prevStart && date <= prevEnd;
    });

    // Calculate metrics for current period
    const currentIncome = currentPeriod
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentExpenses = currentPeriod
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const currentNet = currentIncome - currentExpenses;
    const currentCount = currentPeriod.length;

    // Calculate metrics for previous period
    const prevIncome = previousPeriod
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const prevExpenses = previousPeriod
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const prevNet = prevIncome - prevExpenses;
    const prevCount = previousPeriod.length;

    // Calculate percentage changes
    const incomeChange = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
    const expensesChange = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;
    const netChange = prevNet !== 0 ? ((currentNet - prevNet) / Math.abs(prevNet)) * 100 : 0;
    const countChange = prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0;

    return {
      current: { income: currentIncome, expenses: currentExpenses, net: currentNet, count: currentCount },
      previous: { income: prevIncome, expenses: prevExpenses, net: prevNet, count: prevCount },
      changes: { income: incomeChange, expenses: expensesChange, net: netChange, count: countChange },
      prevStart: prevStart.toISOString().split('T')[0],
      prevEnd: prevEnd.toISOString().split('T')[0],
    };
  }, [transactions, startDate, endDate]);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatChange = (change) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change, isExpense = false) => {
    if (isExpense) {
      // For expenses, decrease is good (green), increase is bad (red)
      return change < 0 ? 'text-green-600' : change > 0 ? 'text-rose-600' : 'text-slate-600';
    } else {
      // For income/net, increase is good (green), decrease is bad (red)
      return change > 0 ? 'text-green-600' : change < 0 ? 'text-rose-600' : 'text-slate-600';
    }
  };

  const getArrow = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Period Comparison</h2>
      <p className="text-xs text-slate-500 mb-4">
        Comparing to previous period ({comparison.prevStart} to {comparison.prevEnd})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Comparison */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-slate-500 mb-1">Income</p>
          <p className="text-xl font-semibold text-slate-900 mb-1">
            {formatCurrency(comparison.current.income)}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${getChangeColor(comparison.changes.income)}`}>
              {getArrow(comparison.changes.income)} {formatChange(comparison.changes.income)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            vs {formatCurrency(comparison.previous.income)}
          </p>
        </div>

        {/* Expenses Comparison */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-slate-500 mb-1">Expenses</p>
          <p className="text-xl font-semibold text-slate-900 mb-1">
            {formatCurrency(comparison.current.expenses)}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${getChangeColor(comparison.changes.expenses, true)}`}>
              {getArrow(comparison.changes.expenses)} {formatChange(comparison.changes.expenses)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            vs {formatCurrency(comparison.previous.expenses)}
          </p>
        </div>

        {/* Net Amount Comparison */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-slate-500 mb-1">Net Amount</p>
          <p className="text-xl font-semibold text-slate-900 mb-1">
            {formatCurrency(comparison.current.net)}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${getChangeColor(comparison.changes.net)}`}>
              {getArrow(comparison.changes.net)} {formatChange(comparison.changes.net)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            vs {formatCurrency(comparison.previous.net)}
          </p>
        </div>

        {/* Transaction Count Comparison */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-slate-500 mb-1">Transactions</p>
          <p className="text-xl font-semibold text-slate-900 mb-1">
            {comparison.current.count}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${getChangeColor(comparison.changes.count)}`}>
              {getArrow(comparison.changes.count)} {formatChange(comparison.changes.count)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            vs {comparison.previous.count}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PeriodComparison;
