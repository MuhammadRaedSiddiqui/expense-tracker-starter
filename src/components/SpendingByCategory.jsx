import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TRANSACTION_TYPES, BASE_CURRENCY } from '../constants';
import { convertToBaseCurrency } from '../utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

function SpendingByCategory({ transactions, exchangeRates }) {
  // Calculate spending by category
  const categoryData = transactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((acc, t) => {
      const amountInBase = convertToBaseCurrency(parseFloat(t.amount), t.currency || BASE_CURRENCY, exchangeRates);

      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += amountInBase;
      return acc;
    }, {});

  const chartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: parseFloat(amount.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingByCategory;
