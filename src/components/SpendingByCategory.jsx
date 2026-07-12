import { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TRANSACTION_TYPES, BASE_CURRENCY } from '../constants';
import { convertToBaseCurrency } from '../utils';

const COLORS = [
  '#d97706',
  '#059669',
  '#0891b2',
  '#dc2626',
  '#7c3aed',
  '#db2777',
  '#0d9488',
  '#ea580c',
  '#0284c7',
  '#65a30d',
];

function SpendingByCategory({ transactions, exchangeRates }) {
  // Calculate spending by category (memoized)
  const categoryData = useMemo(() => {
    return transactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((acc, t) => {
        const amountInBase = convertToBaseCurrency(
          parseFloat(t.amount),
          t.currency || BASE_CURRENCY,
          exchangeRates
        );

        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += amountInBase;
        return acc;
      }, {});
  }, [transactions, exchangeRates]);

  const chartData = useMemo(() => {
    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [categoryData]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-title-sm font-semibold text-slate-900 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={value => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SpendingByCategory);
