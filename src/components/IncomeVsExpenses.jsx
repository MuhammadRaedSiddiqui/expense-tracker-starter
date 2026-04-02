import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
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
      <div className="text-center py-12 text-slate-500">
        <p>No transaction data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Income vs Expenses Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fill: '#64748b'
            }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fill: '#64748b'
            }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem'
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              paddingTop: '1rem'
            }}
          />
          <Area
            type="monotone"
            dataKey="Income"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#colorIncome)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#e11d48"
            strokeWidth={2}
            fill="url(#colorExpenses)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeVsExpenses;
