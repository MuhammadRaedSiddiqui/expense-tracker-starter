import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '@/types';

interface PerformanceChartProps {
  transactions: Transaction[];
}

export default function PerformanceChart({ transactions }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    // Group transactions by date
    const dataByDate = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((t) => {
      const date = t.date;
      const existing = dataByDate.get(date) || { income: 0, expenses: 0 };

      if (t.type === 'income') {
        existing.income += parseFloat(t.amount.toString());
      } else {
        existing.expenses += parseFloat(t.amount.toString());
      }

      dataByDate.set(date, existing);
    });

    // Convert to array and sort by date
    const data = Array.from(dataByDate.entries())
      .map(([date, values]) => ({
        date,
        income: values.income,
        expenses: values.expenses,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days

    return data;
  }, [transactions]);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-tight">
            Performance Delta
          </h3>
          <p className="text-[10px] text-on-surface-variant">
            Consolidated income vs expense flow (30D)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-[10px] font-medium text-on-surface-variant">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span className="text-[10px] font-medium text-on-surface-variant">Expenses</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4a41e1"
                strokeWidth={2}
                dot={false}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ba1a1a"
                strokeWidth={2}
                dot={false}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
            No transaction data available
          </div>
        )}
      </div>
    </div>
  );
}
