import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TRANSACTION_TYPES, BASE_CURRENCY } from '../constants';
import { convertToBaseCurrency } from '../utils';

function IncomeVsExpenses({ transactions, exchangeRates }) {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
    }

    const amountInBase = convertToBaseCurrency(parseFloat(t.amount), t.currency || BASE_CURRENCY, exchangeRates);

    if (t.type === TRANSACTION_TYPES.INCOME) {
      acc[monthKey].income += amountInBase;
    } else {
      acc[monthKey].expenses += amountInBase;
    }

    return acc;
  }, {});

  const chartData = Object.values(monthlyData)
    .map(item => ({
      month: item.month,
      Income: parseFloat(item.income.toFixed(2)),
      Expenses: parseFloat(item.expenses.toFixed(2))
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No transaction data to display</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Income vs Expenses Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeVsExpenses;
