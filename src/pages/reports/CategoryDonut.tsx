import { useMemo } from 'react';
import type { Transaction } from '@/types';

interface CategoryDonutProps {
  transactions: Transaction[];
}

export default function CategoryDonut({ transactions }: CategoryDonutProps) {
  const categoryData = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, current + parseFloat(t.amount.toString()));
      });

    const total = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryTotals.entries())
      .map(([label, amount]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        amount,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  const colors = ['#5B5BD6', '#64748B', '#0D9488', '#D97706', '#DC2626'];

  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-8 left-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">
          Distribution
        </span>
        <h3 className="text-xl font-bold tracking-tight">Category</h3>
      </div>
      
      {categoryData.length > 0 ? (
        <>
          <div className="relative w-48 h-48 mt-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle
                className="text-surface-container-highest"
                cx="96"
                cy="96"
                fill="transparent"
                r="80"
                stroke="currentColor"
                strokeWidth="24"
              />
              {categoryData.map((cat, i) => {
                const total = categoryData.reduce((sum, c) => sum + c.pct, 0);
                const circumference = 2 * Math.PI * 80;
                const offset = categoryData
                  .slice(0, i)
                  .reduce((sum, c) => sum + c.pct, 0);
                const dashArray = circumference;
                const dashOffset = circumference - (circumference * cat.pct) / 100;
                const rotation = (offset / 100) * 360;

                return (
                  <circle
                    key={cat.label}
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="80"
                    stroke={colors[i]}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    strokeWidth="24"
                    style={{
                      transformOrigin: 'center',
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                Total
              </span>
              <span className="text-2xl font-black tabular-nums tracking-tighter">
                100%
              </span>
            </div>
          </div>
          <div className="w-full mt-10 space-y-3">
            {categoryData.map((cat, i) => (
              <div key={cat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[i] }}
                  ></div>
                  <span className="text-xs font-semibold">{cat.label}</span>
                </div>
                <span className="text-xs font-black tabular-nums">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-on-surface-variant text-sm">
          No category data available
        </div>
      )}
    </div>
  );
}
