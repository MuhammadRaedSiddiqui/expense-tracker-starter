import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction } from '@/types';

interface SpendingTrendsProps {
  transactions: Transaction[];
}

export default function SpendingTrends({ transactions }: SpendingTrendsProps) {
  const chartData = useMemo(() => {
    const last30Days = new Map<string, number>();
    const now = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.set(dateStr, 0);
    }

    // Aggregate spending by date
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const dateStr = t.date;
        if (last30Days.has(dateStr)) {
          last30Days.set(dateStr, last30Days.get(dateStr)! + parseFloat(t.amount.toString()));
        }
      });

    return Array.from(last30Days.entries()).map(([date, amount]) => ({
      date,
      amount,
      displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [transactions]);

  const hasData = chartData.some((d) => d.amount > 0);

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Spending Trends
          </h3>
          <p className="text-xs text-on-surface-variant">Daily expense flow (30 days)</p>
        </div>
      </div>
      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)
                }
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#ba1a1a"
                strokeWidth={2}
                dot={false}
                name="Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
            No spending data available for the last 30 days
          </div>
        )}
      </div>
    </div>
  );
}
